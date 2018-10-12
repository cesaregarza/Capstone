const jwt = require("jsonwebtoken");
const keys = require("../gitignore/keys");


module.exports = (req, res, next) => {
   try {
  //   await req.isAuthenticated()
  // console.log( await req.isAuthenticated())
  console.log(req.isAuthenticated(), req.sessionID);
    if ( req.isAuthenticated() ){ 
    const token = req.headers.autorization.split(" ")[1];
    jwt.verify(token, keys.JWT_KEY);
    next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ status: 401, message: "Auth failed" });
  }
};
