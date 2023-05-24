const dotenv = require("dotenv");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

console.log("GOOGLE_CLIENT_ID", GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET", GOOGLE_CLIENT_SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    //it is within this function that you can create a callback function (done) becomes a different callback function to search the database for the user etc. 
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

//to pass the user data to the session you need to serialize and deserialize the user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
