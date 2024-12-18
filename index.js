import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import mongooseConnection from "./config/mongodb.js";
import indexRouter from "./routes/indexRouter.js";
import restaurantRouter from "./routes/restaurantRouter.js";
import jwtStrategy from "./strategies/jwt.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
passport.use(jwtStrategy);
mongooseConnection();

app.use("/api", indexRouter);
app.use("/api/restaurants", restaurantRouter);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
