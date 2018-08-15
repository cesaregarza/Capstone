const jwt = require("jsonwebtoken");
const keys = require("../gitignore/keys");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.autorization.split(" ")[1];
    console.log(token);
    jwt.verify(token, keys.JWT_KEY);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};
