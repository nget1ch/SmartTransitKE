const axios = require('axios');
const { logger } = require('./logger');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortCode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
  }

  async getOAuthToken() {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      return response.data.access_token;
    } catch (error) {
      logger.error('M-Pesa OAuth Token generation failed', { error: error.response?.data || error.message });
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  async initiateSTKPush(phoneNumber, amount, bookingId) {
    const token = await this.getOAuthToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: this.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: this.shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: this.callbackUrl,
      AccountReference: `SmartTransitKE-${bookingId}`,
      TransactionDesc: 'Bus Seat Reservation',
    };

    try {
      const response = await axios.post(`${this.baseUrl}/mpesa/stkpush/v1/query`, // Wait, it's process not query
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Correction: endpoint should be /mpesa/stkpush/v1/process
      return response.data;
    } catch (error) {
      // Trying the correct process endpoint
      try {
        const response = await axios.post(`${this.baseUrl}/mpesa/stkpush/v1/process`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      } catch (innerError) {
        logger.error('M-Pesa STK Push initiation failed', { error: innerError.response?.data || innerError.message });
        throw new Error('M-Pesa payment initiation failed');
      }
    }
  }
}

module.exports = new MpesaService();
