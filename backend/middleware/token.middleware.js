const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

const tokenSecret = process.env.ACCESS_TOKEN_SECRET;

// create  the token
const createToken = (id) => {
  return jwt.sign({ id }, tokenSecret, { expiresIn: maxAge });
};

const requireToken = (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorisatin || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  // check if the token is empty and return an error
  if (!token) {
    return res.status(401).json({
      message: "Token must be provided",
    });
  }

  // verify the token
  if (token) {
    jwt.verify(token, tokenSecret, (err, decodedToken) => {
      if (err) {
        console.log("[INFO ~ jwt]: Authentication failed ", err.message);

        req.user = {
          id: null,
        };

        return res.status(401).json({
          message: "Unathorised",
        });
      } else {
        console.log("[INFO ~ jwt]: Authorised user] -", decodedToken.id);
        console.log("[INFO ~ jwt]: Access granted");
        req.user = decodedToken;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: "An Invalid token was provided",
    });
  }
};

module.exports = {
  createToken,
  maxAge,
  requireToken,
};
