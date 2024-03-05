// this is the conrotller for the auth

const { PrismaClient } = require("@prisma/client");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { createToken, maxAge } = require("../middleware/token.middleware");

const prisma = new PrismaClient();

// @desc GET a user
// @route /auth/login GET
// @access public
const getUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(500).json({
        message: "All fields are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        tweets: true,
        followers: {
          select: {
            followedId: true,
          },
        },
        following: {
          select: {
            followerId: true,
          },
        },
      },
    });

    // user not found
    if (!user) {
      return res.status(404).json({
        message: "Account was not found",
      });
    }

    // unhash the pwd
    const unhashedPassword = await bcrypt.compare(password, user.password);

    if (unhashedPassword) {
      const tweets = await prisma.tweets.findMany({
        where: {
          authorId: user.id,
        },
      });
      const token = createToken(user.id);
      res.cookie("jwt", token, {
        secure: true,
        sameSite: "None",
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      res.status(200).json({
        token: token,
        id: user.id,
        name: user.name,
        email: user.email,
        tweets: user.tweets,
        followers: user.followers,
        following: user.following,
      });
      console.log("[INFO ~ auth]: Log in instance triggered");
    } else {
      return res.status(400).json({
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log("[INFO ~ auth]: Failed to login ", error.message);
  }
};

// register the user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(500).json({
        message: "All fields are required",
      });
    }

    const usernameExist = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });
    if (usernameExist) {
      return res.status(500).json({
        message: "Username is already taken",
      });
    }

    const userExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userExist) {
      return res.status(401).json({
        message: "User already exits",
      });
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: username,
        password: hasedPassword,
        email: email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        followers: {
          include: {
            follower: true,
          },
        },
        following: {
          include: {
            followed: true,
          },
        },
      },
    });

    const token = createToken(user.id);

    console.log("[INFO ~ auth]: User creation instance triggered");
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      followers: user.followers,
      following: user.following,
      token,
    });
  } catch (error) {
    console.log("[INFO ~ auth]: Failed to create user", error);
  }
};

// get the current user and info
const getCurrentUser = async (req, res) => {
  const id = req.user.id || "token";

  if (!id) {
    return res.status(500).json({
      message: "Token ID was not provided",
    });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        tweets: {
          orderBy: {
            createdAt: "desc",
          },
        },
        followers: {
          orderBy: {
            followedId: "desc",
          },
          select: {
            followedId: false,
            followerId: false,
            followed: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        following: {
          orderBy: {
            followerId: "desc",
          },
          select: {
            followedId: false,
            followerId: false,
            follower: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!currentUser) {
      return res.status(404).json({ message: "Could not find the user" });
    }

    res.status(200).json({
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      tweets: currentUser.tweets,
      followers: currentUser.followers,
      following: currentUser.following,
    });
  } catch (error) {
    console.log("[INFO ~ auth]: Failed to get current user: ", error.message);
  }
};

const logOutUser = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Log out was successful" });
};

module.exports = {
  getUser,
  registerUser,
  getCurrentUser,
  logOutUser,
};
