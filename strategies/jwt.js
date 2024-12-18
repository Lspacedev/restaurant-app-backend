import { Strategy, ExtractJwt } from "passport-jwt";
import User from "../models/user.js";
import "dotenv/config";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

const jwtStrategy = new Strategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.userId);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(err, false);
  }
});
export default jwtStrategy;
