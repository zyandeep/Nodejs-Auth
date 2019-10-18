const router = require("express").Router();

// Protect these routes
router.use((req, res, next) => {

  if (req.isAuthenticated()) {
    // let it pass
    next();
  }
  else {
    // needs authentication
    req.flash("error", "You need to login first");
    res.redirect("/login");
  }
});


router.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.user });

});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect('/');
});


module.exports = { router }
