require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const flash = require("express-flash");

// User Model
const User = require("./models/user");
const db = require("./db");
const rootRoute = require("./routes/index");
const userRoute = require("./routes/user");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use(session({
  name: "z-cookie",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());                   // For temporary falsh messages
app.use(passport.initialize());
app.use(passport.session());

// Connect DB
db(mongoose);


// Passport config
const verifyUser = (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    
    if (err) {
      // DB error
      return done(err); 
    }

    if (!user) {
      return done(null, false, { message: "No user exists!" });
    }

    // User exist. Verify password
    bcrypt.compare(password, user.password, (err, same) => {
      if (err) {
        // bcrypt Error
        return done(err);
      }

      if (same) {
        // User found
        return done(null, user);        // request.user
      } 
      else {
        // Password error
        return done(null, false, { message: "Password didn't match!" })
      }

    });

  });
};


passport.use(new LocalStrategy({ usernameField: "email" }, verifyUser));


//  Serialize/Deserialize user instances to and from the session
passport.serializeUser((user, done) => {
  done(null, user._id);
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    
    done(err, user);

  });
});


// Dependency injetion
rootRoute.inject(passport);


//// App Routes
app.use("/", rootRoute.router);
app.use("/users", userRoute.router);


app.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);

});
