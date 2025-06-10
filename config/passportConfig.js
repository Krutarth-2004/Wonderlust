// config/passport.js
const LocalStrategy = require("passport-local");
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "usernameOrEmail",
        passwordField: "password",
      },
      async (usernameOrEmail, password, done) => {
        try {
          // Find user by username or email
          const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
          });
          if (!user) {
            return done(null, false, {
              message: "Invalid username/email or password.",
            });
          }

          // Use the existing authenticate method from passport-local-mongoose
          const isValid = await user.authenticate(password);
          if (!isValid.user) {
            return done(null, false, {
              message: "Invalid username/email or password.",
            });
          }

          return done(null, isValid.user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id); // Use MongoDB _id, which is stable
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
