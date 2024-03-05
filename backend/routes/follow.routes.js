const express = require("express");
const {
  addFollowing,
  removeFollowing,
} = require("../controllers/follow.controller");

const router = express.Router();

router.post("/", addFollowing);
router.post("/u", removeFollowing);

module.exports = router;
