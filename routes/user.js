const express = require("express");
const router = new express.Router();

const userController = require("../controllers/user.js");

router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);

router.post("/logout", userController.logoutUser);

module.exports = router;
