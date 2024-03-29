const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const jwtSecretKey = "myjwtsecretkey";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  //Check token is Present in headers
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required in headers",
    });
  }

  //Check JWT is generated by our web app
  try {
    jwt.verify(token, jwtSecretKey);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JWT",
    });
  }

  //Check the expiry of Token
  const decodedToken = jwt.decode(token);
  const now = Math.floor(Date.now() / 1000);
  if (decodedToken < now) {
    return res.status(404).json({
      success: false,
      meassge: "Token expired, please re-login",
    });
  }

  //Check the user from DB and match the token
  const user = await User.findById(decodedToken._id);
  if (user.token !== token) {
    return res.status(404).json({
      success: false,
      meassge: "Invalid JWT",
    });
  }
  req.user = user;
  next();
};

module.exports = authMiddleware;
