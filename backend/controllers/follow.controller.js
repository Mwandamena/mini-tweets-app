// this is the conrotller for the model tweets

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// add a follower
const addFollowing = async (req, res) => {
  const { id, followedId } = req.body;

  if (!id || !followedId) {
    return res.status(401).json({
      message: "User IDs must be provided to complete the action",
    });
  }

  try {
    const followExist = await prisma.follow.findFirst({
      where: {
        followerId: id,
        followedId: followedId,
      },
    });

    if (followExist) {
      return res.status(401).json({
        message: "The record already exitst!",
      });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: Number(id),
        followedId: Number(followedId),
      },
    });

    if (!follow) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }

    res.status(201).json({
      message: "Following sucess",
      follow,
    });
  } catch (error) {
    console.log("[INFO ~ follow]: Failed to add follower: ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// remove a removeFollowing
const removeFollowing = async (req, res) => {
  const { id, followedId } = req.body;
  if (!id || !followedId) {
    return res.status(401).json({
      message: "User IDs must be provided to complete the action",
    });
  }

  try {
    const follow = await prisma.follow.delete({
      where: {
        followerId_followedId: {
          followerId: id,
          followedId: followedId,
        },
      },
    });

    if (!follow) {
      return res.status(500).json({
        message: "The record could not be found",
      });
    }

    res.status(201).json({
      message: "Unfollow sucess",
      follow,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    console.log("[INFO ~ follow]: Failed to remove follower: ", error.message);
  }
};

module.exports = { addFollowing, removeFollowing };
