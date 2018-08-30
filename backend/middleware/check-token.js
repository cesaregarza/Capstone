const Token = require("../models/tokens");
const objectId = require("mongoose").Types.ObjectId

module.exports = (req, res, next) => {
  try {
    console.log(!!objectId.isValid(req.body.tokenId))
    if (req.body.usertype == 2 && objectId.isValid(req.body.tokenId)) {
      Token.findOne({
        _id: req.body.tokenId,
        expirationDate: { $gte: Date.now() }
      })
        .exec()
        .then(result => {
          if (result) {
            next();
          } else {
            return res.status(401).json({ status: 401, message: "Not valid" });
          }
        });
    } else if (req.body.usertype == 1) {
      next();
    } else {

      return res.status(401).json({ status: 401, error: "Error" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
};
