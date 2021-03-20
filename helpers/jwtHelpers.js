const jwt = require("jsonwebtoken");

module.exports.validLogin = async function(req, res) {
  if(req.signedCookies.user) {
    try {
      await jwt.verify(req.signedCookies.user, process.env.SECRET);
      return true;
    } catch(err) {
      res.sendStatus(401);
      return false;
    }
  } else {
    res.sendStatus(401);
    return false;
  }
};