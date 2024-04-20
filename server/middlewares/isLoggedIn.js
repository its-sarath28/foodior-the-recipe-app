const appError = require("../utils/appError");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLoggedIn = (req, res, next) => {
  const token = getTokenFromHeader(req);

  const decodedUser = verifyToken(token);

  req.userAuth = decodedUser.id;
  req.isAdmin = decodedUser.isAdmin;

  if (!decodedUser) {
    return next(appError("Invalid / Expired token"));
  } else {
    next();
  }
};

module.exports = isLoggedIn;
