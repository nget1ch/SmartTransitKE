const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");
const { logger } = require("../utils/logger");

const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "OPERATOR", "CUSTOMER"]).default("CUSTOMER"),
  registrationKey: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

async function register(data) {
  const validated = RegisterSchema.parse(data);
  const { name, email, password, role, registrationKey } = validated;

  // Role Protection
  if (role === "ADMIN") {
    if (registrationKey !== process.env.ADMIN_BOOTSTRAP_KEY) {
      throw new ApiError("Invalid bootstrap key for ADMIN role", 403, "FORBIDDEN");
    }
  } else if (role === "OPERATOR") {
    if (registrationKey !== process.env.OPERATOR_REGISTRATION_KEY) {
      throw new ApiError("Invalid registration key for OPERATOR role", 403, "FORBIDDEN");
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    return await prisma.$transaction(async (tx) => {
      let dbRole = await tx.role.findUnique({ where: { name: role } });
      if (!dbRole) {
        // Fallback for missing roles during first run
        dbRole = await tx.role.create({ data: { name: role } });
      }

      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          roleId: dbRole.id,
        },
        select: { id: true, name: true, email: true, role: { select: { name: true } } },
      });

      logger.info(`New user registered: ${user.email} as ${role}`);
      return user;
    });
  } catch (err) {
    if (err.code === "P2002") {
      throw new ApiError("Email already in use", 409, "EMAIL_IN_USE");
    }
    logger.error("Registration error", { error: err });
    throw err;
  }
}

async function login({ email, password }) {
  const validated = LoginSchema.parse({ email, password });

  const user = await prisma.user.findUnique({
    where: { email: validated.email.toLowerCase() },
    include: { role: true },
  });

  if (!user) throw new ApiError("Invalid credentials", 401, "UNAUTHORIZED");

  const valid = await bcrypt.compare(validated.password, user.passwordHash);
  if (!valid) throw new ApiError("Invalid credentials", 401, "UNAUTHORIZED");

  const tokens = await generateTokens(user);

  logger.info(`User logged in: ${user.email}`);

  return {
    ...tokens,
    user: { id: user.id, name: user.name, email: user.email, role: user.role.name },
  };
}

async function generateTokens(user) {
  const payload = { sub: user.id, role: user.role.name };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

  // Store refresh token in DB
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { accessToken, refreshToken };
}

async function refresh(oldToken) {
  try {
    const payload = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);
    
    const stored = await prisma.refreshToken.findUnique({
      where: { token: oldToken },
      include: { user: { include: { role: true } } },
    });

    if (!stored || stored.revokedAt || new Date() > stored.expiresAt) {
      throw new ApiError("Invalid or expired refresh token", 401, "UNAUTHORIZED");
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return await generateTokens(stored.user);
  } catch (err) {
    throw new ApiError("Invalid refresh token", 401, "UNAUTHORIZED");
  }
}

async function logout(token) {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { revokedAt: new Date() },
  });
}

module.exports = { register, login, refresh, logout };

