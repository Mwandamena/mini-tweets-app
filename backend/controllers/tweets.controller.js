// this is the conrotller for the model tweets

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// @desc create a tweet
// @route /tweets POST
// @access private
const createTweet = async (req, res) => {
  const { authorId, content } = req.body;

  // validate request
  if (!authorId || !content) {
    return res.status(401).json({
      message: "All fields are required",
    });
  }

  // get the author information
  const tweetAuthor = prisma.user.findFirst({
    where: {
      id: Number(authorId),
    },
  });

  // create the tweet
  try {
    const tweet = await prisma.tweets.create({
      data: {
        authorId: Number(authorId),
        content: content,
      },
    });
    res.status(201).json({
      tweet,
      tweetAuthor,
    });
    console.log("[INFO ~ tweet]: Tweet creation instance triggerd");
  } catch (error) {
    res.status(501).json({ message: "Failed to create tweet" });
    console.log("[INFO ~ tweet]: Failed to create tweet", error.message);
  }
};

// @desc get all tweets
// @route /tweets GET
// @access private
const getAllTweets = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(500).json({
      message: "User ID not provided",
    });
  }

  try {
    const feed = await prisma.tweets.findMany({
      where: {
        authorId: {
          in: (
            await prisma.user
              .findUnique({
                where: {
                  id: userId,
                },
              })
              .followers({
                select: {
                  followedId: true,
                },
              })
          ).map((u) => u.followedId),
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!feed) {
      return res.status(500).json({
        message: "Failed to fetch tweets",
      });
    }

    res.status(200).json({
      feed,
    });
  } catch (error) {
    console.log("[INFO ~ tweet]: Failed to fetch tweets", error);
  }
};

// @desc get a tweet
// @route /tweets/:id GET
// @access private
const getTweet = async (req, res) => {
  const { id } = req.params;

  // invalid id
  if (!id) {
    return res.status(401).json({
      message: "Invalid tweet id",
    });
  }

  try {
    // create the tweet
    const tweet = await prisma.tweets.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet was not found",
      });
    }

    res.status(200).json({
      tweet,
    });
  } catch (error) {
    res.status(501).json("Failed to find tweet");
    console.log("[INFO ~ tweet]: Failed to get tweet", error.message);
  }
};

// @desc edit a tweet
// @route /tweets/:id GET
// @access public
const editTweet = async (req, res) => {
  const currentUser = req.user.id;
  const { content } = req.body;
  const { id } = req.params;

  if (!currentUser || !content || !id) {
    return res.status(400).json({
      message: "Credentials required to edit tweet",
    });
  }

  try {
    // find the tweet that is been edited
    const targetTweet = await prisma.tweets.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!targetTweet) {
      return res.status(404).json({
        message: "Tweet not found",
      });
    }

    // check ownership of tweet
    if (targetTweet.authorId == Number(currentUser)) {
      // delete the tweet
      try {
        const editedTweet = await prisma.tweets.update({
          where: {
            id: Number(id),
          },
          data: {
            content: content,
          },
        });
        return res.status(201).json({
          message: "Tweet was edited!",
          editedTweet,
        });
      } catch (error) {
        console.log("[INFO ~ tweet]: Failed to edit tweet ", error.message);
        return res.status(500).json({
          message: "Failed to edit tweet",
        });
      }
    } else {
      return res.status(401).json({
        message: "User not authorised to edit tweeet.",
      });
    }
  } catch (error) {
    res.status(501).json("Failed to edit tweet");
    console.log("[INFO ~ tweet]: edit to get delete", error);
  }
};

// @desc delete a tweet
// @route /tweets/:id GET
// @access public
const deleteTweet = async (req, res) => {
  const currentUser = req.user.id;
  const { id } = req.params;

  if (!currentUser || !id) {
    return res.status(400).json({
      message: "Credentials required to edit tweet",
    });
  }

  try {
    // find the tweet that is been deleted
    const targetTweet = await prisma.tweets.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!targetTweet) {
      return res.status(404).json({
        message: "Tweet not found",
      });
    }

    // check ownership of tweet
    if (targetTweet.authorId == Number(currentUser)) {
      // delete the tweet
      try {
        const tweet = await prisma.tweets.delete({
          where: {
            id: Number(id),
          },
        });
        if (!tweet) {
          return res.status(500).json({
            message: "Something went wrong while deleting the tweet.",
          });
        }
        return res.status(200).json({
          message: "Tweet was deleted!",
          tweet,
        });
      } catch (error) {
        console.log("[INFO ~ tweet]: Failed to delete tweet ", error.message);
        return res.status(400).json({
          message: "Failed to delete tweet",
        });
      }
    } else {
      return res.status(401).json({
        message: "User not authorised to delete tweeet.",
      });
    }
  } catch (error) {
    res.status(501).json("Failed to delete tweet");
    console.log("[INFO ~ tweet]: Failed to get delete", error);
  }
};

module.exports = {
  createTweet,
  getAllTweets,
  getTweet,
  editTweet,
  deleteTweet,
};
