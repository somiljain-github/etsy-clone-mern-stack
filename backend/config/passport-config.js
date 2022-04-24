const dotenv = require("dotenv");

const passport = require("passport"),
  User = require("../models/userModel"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt;

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};
//test
passport.use(
  "jwt",
  new JwtStrategy(opts, (jwt_payload, done) => {
    try {
      User.findOne({
        where: {
          username: jwt_payload._id,
        },
      }).then((user) => {
        if (user) {
          console.log("user found in database in passport");
          done(null, user);
        } else {
          console.log("user not found in database");
          done(null, false);
        }
      });
    } catch (err) {
      done(err, false);
    }
  })
);
