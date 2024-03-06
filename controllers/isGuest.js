const isAuthenticated = require("../controllers/isAuthenticated");

function checkGuest(req, res, next) {
  if (req.session.currentUser && req.session.currentUser.kind === "Guest") {
    return next();
  } else {
    res.redirect("/guest/home");
  }
}

module.exports = checkGuest;
