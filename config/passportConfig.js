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
          const input = usernameOrEmail.trim().toLowerCase();
          const user = await User.findOne({
            $or: [{ username: input }, { email: input }],
          });

          if (!user) {
            return done(null, false, {
              message: "Invalid username/email or password.",
            });
          }

          const { user: authenticatedUser, error } = await user.authenticate(
            password
          );
          if (error || !authenticatedUser) {
            return done(null, false, {
              message: "Invalid username/email or password.",
            });
          }

          return done(null, authenticatedUser);
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("Passport authentication error:", err);
          }
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
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
