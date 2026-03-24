const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");

function ensureRoleAllowed(role, registrationKey) {
  const ADMIN = "ADMIN";
  const OPERATOR = "OPERATOR";
  const PASSENGER = "PASSENGER";

  const normalized = String(role || PASSENGER).toUpperCase();
  const allowedRoles = [ADMIN, OPERATOR, PASSENGER];
  if (!allowedRoles.includes(normalized)) {
    throw new ApiError("Invalid role", 400, "INVALID_ROLE");
  }

  if (normalized === ADMIN) {
    const expected = process.env.ADMIN_BOOTSTRAP_KEY;
    if (!expected || !registrationKey || registrationKey !== expected) {
      throw new ApiError("Not allowed to register ADMIN", 403, "FORBIDDEN");
    }
  }

  if (normalized === OPERATOR) {
    const expected = process.env.OPERATOR_REGISTRATION_KEY;
    if (!expected || !registrationKey || registrationKey !== expected) {
      throw new ApiError("Not allowed to register OPERATOR", 403, "FORBIDDEN");
    }
  }

  return normalized;
}

async function register({ name, email, password, role, registrationKey }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedRole = ensureRoleAllowed(role, registrationKey);

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        role: normalizedRole,
        passwordHash,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return user;
  } catch (err) {
    // Prisma unique violation (email)
    if (err && err.code === "P2002") {
      throw new ApiError("Email already in use", 409, "EMAIL_IN_USE");
    }
    throw err;
  }
}

async function login({ email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) throw new ApiError("Invalid credentials", 401, "UNAUTHORIZED");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError("Invalid credentials", 401, "UNAUTHORIZED");

  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

module.exports = { register, login };

