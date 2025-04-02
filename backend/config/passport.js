const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const User = require('../models/userModel')

dotenv.config();


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with this email already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If no existing user, create a new one
          user = await User.create({
            username: profile.displayName || `user_${Date.now()}`, 
            email: profile.emails[0].value,
            password: undefined, 
            profilePic: profile.photos[0]?.value || "",
          
          });
        }
        console.log("User found or created:", user);

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and Deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
