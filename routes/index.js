const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

let passport = require("passport");

function inject(depndency) {
  passport = depndency;
}

// If users already logged in, send them to /users/dashboard
router.use((req, res, next) => {

  // console.log("[path]: ", req.path);
  
  if (req.isAuthenticated()) {
    switch (req.path) {
      case "/":
      case "/login":
      case "/register":
        res.redirect("/users/dashboard");
        break;

      default:
        next();         // Go forward...
    }
  }
  else {
    next();       // Move forward...
  }

});


router.get("/", (req, res) => {
  res.render("index");

});

// User Registration
router.route("/register")

  .get((req, res) => {
    res.render("register");

  })

  .post((req, res) => {
    const { name, email, password } = req.body;

    // Validation needed

    User.findOne({ email }, (err, user) => {

      if (err) {
        // DB error
        console.error("[mongoose]: ", err);

        req.flash("error", "Error connecting to database");
        res.render("register");
      }
      else {
        // Register a new user
        // Hash the password
        bcrypt.hash(password, 5, (err, hash) => {

          if (err) {
            // bcrypt error
            console.error("[bcrypt]: ", err);

            req.flash("error", "Error hassing password");
            res.render("register");
          }
          else {
            console.log("hash: ", hash);

            new User({
              name,
              email,
              password: hash
            }).save(err => {

              if (err) {
                // DB error
                console.error("[mongoose]: ", err);

                req.flash("error", "Error registering user");
                res.render("register");
              }
              else {
                // Registered successfully. Let user login

                req.flash("info", "You can now Login");
                res.redirect("/login");
              }

            });
          }

        });

      }

    })

  });


// User Login
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate('local',
  {
    successRedirect: '/users/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })
);


module.exports = {
  router,
  inject
};
