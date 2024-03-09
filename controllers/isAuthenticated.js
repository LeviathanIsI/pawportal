const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.currentUser) {
    return next();
  }
  res.redirect("/");
};

module.exports = isAuthenticated;
