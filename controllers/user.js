const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const validateRegistrationData = require("../validations/register.js");
const validateUserData = require("../validations/login.js");
const { json } = require("express");
const logger = require("../utils/logger.js");

const jwtSecretKey = "myjwtsecretkey";

const registerUser = async (req, res) => {
  const err = validateRegistrationData(req.body);

  if (err.hasError) {
    return res.json({
      success: false,
      message: err.message,
    });
  }

  const plainPassowrd = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(plainPassowrd, salt);

  userDetails.password = hashPassword;

  const user = new User(userDetails);
  await user.save();
  res.json({
    success: true,
    message: "User registered successfully",
  });
};

const loginUser = async (req, res) => {
  const email = req.body.email;
  const plainPassowrd = req.body.password;

  const err = validateUserData(req.body);

  if (err.hasError) {
    return res.json({
      success: false,
      message: err.message,
    });
  }

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      meassage: "User doesn't exist",
    });
  }

  const isPasswordValid = await bcrypt.compare(plainPassowrd, user.password);

  if (!isPasswordValid) {
    //User has entered wrong password
    logger.info("LOGIN_FAILURE", {
      timestamp: timestamp,
      reason: "Wrong password for " + email,
    });
    return res.status(400).json({
      success: false,
      message: "Incorrect username or password",
    });
  }

  logger.info("LOGIN_SUCCESSFULL", {
    timestamp: new Date(),
    email: user.email,
  });

  const payload = {
    exp: Math.floor(Date.now() / 1000 + 3600),
    email: user.email,
    _id: user._id,
  };

  const token = jwt.sign(payload, jwtSecretKey);

  await User.findByIdAndUpdate(user._id, {
    token: token,
  });

  res.json({
    success: true,
    token: token,
  });
};

const logoutUser = async (req, res) => {
  const decodedToken = jwt.decode(req.headers.authorization);
  await User.findByIdAndUpdate(decodedToken._id, { token: "" });
  logger.info("LOGOUT_SUCCESSFULL", {
    timestamp: new Date(),
    reason: "Logout successfully for " + decodedToken.email,
  });
  res.json({
    success: true,
    meassage: "User logout successfully",
  });
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
};
