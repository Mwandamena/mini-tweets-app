// this is the conrotller for the model app
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const { createToken } = require("../middleware/token.middleware");

const prisma = new PrismaClient();

// @desc get all users
// @route /users GET
// @access private
async function getUsers(req, res) {
  const currentUserId = req.user.id;

  try {
    // fetch all users
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          following: {
            some: {
              followerId: currentUserId,
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        followers: {
          include: {
            followed: {
              select: {
                name: true,
                email: true,
                id: true,
              },
            },
            follower: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        following: {
          include: {
            follower: {
              select: {
                name: true,
                email: true,
                id: true,
              },
            },
            followed: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    if (!users) {
      return res.status(500).json({
        message: "Error fetching all users",
      });
    }

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch data",
    });
    console.log("[INFO ~ users]: ", error.message);
  }
}

// @desc get a user
// @route GET /users/id
// @access private
async function getUser(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "An ID must be provided",
    });
  }

  // get the user
  try {
    // user
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        email: true,
        tweets: {
          orderBy: {
            createdAt: "desc",
          },
        },
        followers: {
          orderBy: {
            followedId: "desc",
          },
          include: {
            followed: {
              select: {
                name: true,
                email: true,
                id: true,
              },
            },
          },
        },
        following: {
          orderBy: {
            followerId: "desc",
          },
          include: {
            follower: {
              select: {
                name: true,
                email: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Could not find user",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not find the user",
    });
    console.log("[INFO ~ user]: Failed to get user - ", error.message);
  }
}

// @desc search users
// @route GET /users/search/?q=query
// @access private
async function searchUsers(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(200).json({
      message: "Search query was not provided",
      results: [],
    });
  }

  try {
    const results = await prisma.user.findMany({
      where: {
        name: {
          contains: q,
        },
      },
      select: {
        email: true,
        name: true,
        id: true,
        following: {
          include: {
            followed: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        followers: {
          include: {
            follower: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!results) {
      return res.status(200).json({
        message: "There are no search results",
      });
    }

    res.status(200).json({
      results,
      searchFor: q,
    });
  } catch (error) {
    console.log("[INFO user]:", error.message);
  }
}

// @desc delete a user
// @route /users/:id
// @access private
const editUser = async (req, res) => {
  const currentUser = req.user.id;
  const { username, email, oldPassword, newPassword } = req.body;
  const { id } = req.params;

  if (!currentUser || !id) {
    return res.status(401).json({
      message: "Authorised credentials required to edit a user.",
    });
  }

  if (!username || !email || !oldPassword || !newPassword) {
    return res.status(400).json({
      message: "All fields are required to edit profile",
    });
  }

  try {
    // find the user to edit
    const targetUser = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "User to edit not found",
      });
    }

    if (targetUser.id == Number(currentUser)) {
      // check for passwords
      const unhashedPassword = await bcrypt.compare(
        oldPassword,
        targetUser.password
      );

      if (!unhashedPassword) {
        return res.status(400).json({
          message: "The old password provided does not match in the database",
        });
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const token = createToken(currentUser);

      const user = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name: username,
          email: email,
          password: hashedPassword,
        },
        select: {
          email: true,
          id: true,
          name: true,
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
      return res.status(201).json({
        token,
        ...user,
      });
    } else {
      return res.status(401).json({
        message: "User not authorised to edit this user",
      });
    }
  } catch (error) {
    console.log("[INFO ~ user]: Failed to edit user ", error.message);
  }
};

// @desc delete a user
// @route /users/:id
// @access private
async function deleteUser(req, res) {
  const currentUser = req.user.id;
  const { id } = req.params;

  if (!currentUser || !id) {
    return res.status(401).json({
      message: "Authorised credentials required to delete a user.",
    });
  }

  if (!id) {
    return res.status(401).json({
      message: "ID required to delete a user.",
    });
  }

  try {
    // find the user to delete
    const targetUser = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "User to delete not found",
      });
    }

    if (targetUser.id == Number(currentUser)) {
      const user = await prisma.user.delete({
        where: {
          id: Number(targetUser.id),
        },
      });
      const tweets = await prisma.tweets.deleteMany({
        where: {
          authorId: user.id,
        },
      });
      return res.status(200).json({
        message: "Your account was deleted",
        user,
        tweets,
      });
    } else {
      return res.status(401).json({
        message: "User not authorised to delete this user",
      });
    }
  } catch (error) {
    console.log("[INFO ~ user]: Failed to delete user ", error.message);
  }
}

// @desc create a user
// @route /users/:id
// @access private
const getUserTweets = async (req, res) => {
  const { id } = req.params;

  // validation
  if (!id) {
    return res.status(400).json({
      message: "ID must be provided",
    });
  }

  try {
    // find the user and tweets
    const usertweets = await prisma.tweets.findMany({
      where: {
        authorId: Number(id),
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user || usertweets) {
      return res.status(404).json({
        message: "Author tweets could not be found",
      });
    }

    res.status(200).json({
      usertweets,
      author: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tweets",
    });
    console.log("[INFO ~ user(tweets)]: Failed to get tweets", error.message);
  }
};

module.exports = {
  getUsers,
  getUser,
  editUser,
  deleteUser,
  getUserTweets,
  searchUsers,
};
