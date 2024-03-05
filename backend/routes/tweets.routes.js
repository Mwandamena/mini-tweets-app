const express = require("express");
const {
  createTweet,
  getAllTweets,
  getTweet,
  deleteTweet,
  editTweet,
} = require("../controllers/tweets.controller");
const { getUserTweets } = require("../controllers/user.controller");

// init
const router = express.Router();

// create a tweet and get all tweets
router.route("/").post(createTweet).get(getAllTweets);

// get single tweet and delete tweet
router.route("/:id").get(getTweet).put(editTweet).delete(deleteTweet);

module.exports = router;
