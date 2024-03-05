const express = require("express");

const {
  getUser,
  getUsers,
  deleteUser,
  getUserTweets,
  searchUsers,
  editUser,
} = require("../controllers/user.controller");

const router = express.Router();

// create a user and get all users
router.route("/").get(getUsers);
router.get("/search", searchUsers);

// get a single user and delete a single user
router.route("/:id").get(getUser).put(editUser).delete(deleteUser);

router.route("/tweets/:id").get(getUserTweets);

module.exports = router;
