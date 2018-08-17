const jwt = require("jsonwebtoken");
const keys = require("../gitignore/keys");

const passport = require('../middleware/passport');

module.exports = (req, res, next) => {
  try {
    // console.log(req.isAuthenticated())
    if ( req.isAuthenticated() ){ 
    const token = req.headers.autorization.split(" ")[1];
    jwt.verify(token, keys.JWT_KEY);
    next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};
