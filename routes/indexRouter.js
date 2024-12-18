import { Router } from "express";
import indexController from "../controllers/indexController.js";
import Authenticate from "../middleware/Authenticate.js";
import Authorize from "../middleware/Authorize.js";

const indexRouter = Router();
indexRouter.get("/test", (req, res) => {
  res.json({ message: "alive" });
});

indexRouter.post("/register", indexController.userRegister);
indexRouter.post("/login", indexController.userLogin);
indexRouter.get("/profile", Authenticate, indexController.getUser);
indexRouter.put("/profile", Authenticate, indexController.updateUser);
indexRouter.get(
  "/restaurant",
  Authenticate,
  Authorize("ADMIN"),
  indexController.getAdminResaurant
);
indexRouter.post(
  "/notifications",
  Authenticate,
  Authorize("ADMIN"),
  indexController.pushNotifications
);

indexRouter.get(
  "/bookings",
  Authenticate,
  Authorize("USER"),
  indexController.getUserBookings
);

indexRouter.get(
  "/reviews",
  Authenticate,
  Authorize("USER"),
  indexController.getUserReviews
);
indexRouter.get(
  "/reviews/:reviewId",
  Authenticate,
  Authorize("USER"),
  indexController.getUserReviewById
);
indexRouter.put(
  "/reviews/:reviewId",
  Authenticate,
  Authorize("USER"),
  indexController.updateReviewById
);
indexRouter.delete(
  "/reviews/:reviewId",
  Authenticate,
  Authorize("USER"),
  indexController.deleteReviewById
);
export default indexRouter;
