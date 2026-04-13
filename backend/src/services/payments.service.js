const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");
const { logger } = require("../utils/logger");
const mpesa = require("../utils/mpesa");

async function initiatePayment({ userId, bookingId, phoneNumber }) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { trip: { include: { route: true } } },
  });

  if (!booking) throw new ApiError("Booking not found", 404, "NOT_FOUND");
  if (booking.userId !== userId) throw new ApiError("Access denied", 403, "FORBIDDEN");
  if (booking.status !== "PENDING") throw new ApiError("Booking is not in a payable state", 400, "INVALID_STATE");

  const amount = Math.round(Number(booking.trip.route.basePrice)); // Ensure integer for Safaricom

  try {
    const result = await mpesa.initiateSTKPush(phoneNumber, amount, bookingId);
    
    // Store checkout request ID in Payment record
    await prisma.payment.upsert({
      where: { bookingId },
      update: {
        checkoutRequestId: result.CheckoutRequestID,
        amount: booking.trip.route.basePrice,
        status: "PENDING",
      },
      create: {
        bookingId,
        checkoutRequestId: result.CheckoutRequestID,
        amount: booking.trip.route.basePrice,
        status: "PENDING",
      },
    });

    logger.info(`M-Pesa STK Push initiated for booking ${bookingId}. RequestID: ${result.CheckoutRequestID}`);
    return { message: "STK Push initiated. Please enter your PIN on your phone.", checkoutRequestId: result.CheckoutRequestID };
  } catch (error) {
    logger.error("Payment initiation failed", { error });
    throw new ApiError("Could not initiate M-Pesa payment", 500, "PAYMENT_INIT_FAILED");
  }
}

async function handleMpesaCallback(callbackData) {
  const { Body: { stkCallback } } = callbackData;
  const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
      include: { booking: true },
    });

    if (!payment) {
      logger.error(`Received callback for unknown CheckoutRequestID: ${CheckoutRequestID}`);
      return;
    }

    if (ResultCode === 0) {
      // Success
      const mpesaRef = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber').Value;
      
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          mpesaReference: mpesaRef,
        },
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
      });

      logger.info(`Payment successful for booking ${payment.bookingId}. Ref: ${mpesaRef}`);
    } else {
      // Failed
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: "FAILED" },
      });

      logger.warn(`Payment failed for booking ${payment.bookingId}. Reason: ${ResultDesc}`);
    }
  });
}

module.exports = { initiatePayment, handleMpesaCallback };

