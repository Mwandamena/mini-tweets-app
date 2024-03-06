const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// load env variables
dotenv.config();

// controllers
const {
  getUsers,
  createUser,
  getUser,
} = require("./controllers/user.controller");
const errorHandler = require("./middleware/errorHandler");

// routes
const userRouter = require("./routes/user.routes");
const tweetsRouter = require("./routes/tweets.routes");
const authRouter = require("./routes/auth.routes");
const { requireToken } = require("./middleware/token.middleware");
const followRouter = require("./routes/follow.routes");

const app = express();
const port = process.env.PORT || 3000;

// enable cors
app.use(
  cors({
    origin: "https://mini-tweets-app.vercel.app/",
    credentials: true,
    methods: "GET, POST, DELETE, PUT",
  })
);

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth/", authRouter);

app.use("/api/v1/users", requireToken, userRouter);

app.use("/api/v1/tweets", requireToken, tweetsRouter);

app.use("/api/v1/follow", requireToken, followRouter);

app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});
