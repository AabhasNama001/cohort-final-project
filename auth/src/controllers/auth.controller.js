const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../db/redis");
const { publishToQueue } = require("../broker/broker");

async function registerUser(req, res) {
  const {
    username,
    email,
    password,
    fullName: { firstName, lastName },
    role,
  } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [
      {
        username,
      },
      {
        email,
      },
    ],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
    fullName: {
      firstName,
      lastName,
    },
    role: role || "user",
  });

  await Promise.all([
    publishToQueue("AUTH_NOTIFICATION.USER_CREATED", {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    }),
    publishToQueue("AUTH_SELLER_DASHBOARD.USER_CREATED", user),
  ]);

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    // Only set secure flag in production (localhost/dev can't use secure cookies over HTTP)
    secure: process.env.NODE_ENV === 'production',
    // When in production and serving from different origin (e.g., CDN), you may want 'none'
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      addresses: user.addresses,
    },
  });
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;
  const user = await userModel
    .findOne({ $or: [{ email }, { username }] })
    .select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password || "");
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      addresses: user.addresses,
    },
  });
}

async function getCurrentUser(req, res) {
  return res.status(200).json({
    message: "Current user fetched successfully",
    user: req.user,
  });
}

async function logoutUser(req, res) {
  const token = req.cookies.token;
  //  Blacklist the token in Redis
  if (token) {
    await redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60); // Set expiry to 1 day
  }
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return res.status(200).json({ message: "Logged out successfully" });
}

async function getUserAdresses(req, res) {
  const id = req.user.id;
  const user = await userModel.findById(id).select("addresses");
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  return res.status(200).json({
    message: "User addresses fetched successfully",
    addresses: user.addresses,
  });
}

async function addUserAddress(req, res) {
  const id = req.user.id;
  const { street, city, state, pincode, phone, country, isDefault } = req.body;

  // ✅ Validation
  if (!/^\d{5,6}$/.test(pincode)) {
    return res
      .status(400)
      .json({ message: "Invalid pincode. Must be 5 or 6 digits." });
  }
  if (phone && !/^\d{10}$/.test(phone)) {
    return res
      .status(400)
      .json({ message: "Invalid phone number. Must be 10 digits." });
  }

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        addresses: {
          street,
          city,
          state,
          pincode,
          phone, // ✅ include phone now
          country,
          isDefault,
        },
      },
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(201).json({
    message: "Address added successfully",
    address: user.addresses[user.addresses.length - 1],
  });
}

async function deleteUserAdresses(req, res) {
  const id = req.user.id;
  const { addressId } = req.params;

  const isAddressExists = await userModel.find({
    _id: id,
    "addresses._id": addressId,
  });
  if (!isAddressExists || isAddressExists.length === 0) {
    return res.status(404).json({
      message: "Address not found",
    });
  }

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $pull: {
        addresses: { _id: addressId },
      },
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const addressExists = user.addresses.some(
    (addr) => addr._id.toString() === addressId
  );

  if (addressExists) {
    return res.status(500).json({ message: "Failed to delete address" });
  }

  return res.status(200).json({
    message: "Address deleted successfully",
    addresses: user.addresses,
  });
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getUserAdresses,
  addUserAddress,
  deleteUserAdresses,
};
