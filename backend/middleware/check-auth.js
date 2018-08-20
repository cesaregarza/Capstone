const jwt = require("jsonwebtoken");
const keys = require("../gitignore/keys");


module.exports = (req, res, next) => {
   try {
  //   await req.isAuthenticated()
  // console.log( await req.isAuthenticated())
    if ( req.isAuthenticated() ){ 
    const token = req.headers.autorization.split(" ")[1];
    jwt.verify(token, keys.JWT_KEY);
    next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};
