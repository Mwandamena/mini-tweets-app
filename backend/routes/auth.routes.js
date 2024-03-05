const express = require("express");
const {
  getUser,
  registerUser,
  getCurrentUser,
  logOutUser,
} = require("../controllers/auth.controller");
const { requireToken } = require("../middleware/token.middleware");

// init
const router = express.Router();

// login a user
router.route("/login").post(getUser);
router.route("/signup").post(registerUser);
router.get("/current", requireToken, getCurrentUser);
router.route("/logout").get(logOutUser);

module.exports = router;
