function authMiddleware(req, res, next) {

  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Unauthorized. Please login.");
  }

}

module.exports = authMiddleware;