import { Router } from "express";
import restaurantController from "../controllers/restaurantController.js";
import Authenticate from "../middleware/Authenticate.js";
import Authorize from "../middleware/Authorize.js";
import upload from "../config/multer.js";
const restaurantRouter = Router();
restaurantRouter.get(
  "/",
  Authenticate,
  Authorize("USER"),
  restaurantController.getRestaurants
);
restaurantRouter.get(
  "/:restaurantId",
  Authenticate,
  restaurantController.getRestaurantById
);
restaurantRouter.get(
  "/:restaurantId/bookings",
  Authenticate,
  Authorize("ADMIN"),
  restaurantController.getRestaurantBookings
);
restaurantRouter.post(
  "/:restaurantId/bookings",
  Authenticate,
  Authorize("USER"),
  restaurantController.createBooking
);
restaurantRouter.put(
  "/:restaurantId/bookings/:bookingId",
  Authenticate,
  Authorize("ADMIN"),
  restaurantController.updateBooking
);
restaurantRouter.post(
  "/",
  Authenticate,
  Authorize("ADMIN"),
  upload.single("image"),
  restaurantController.createRestaurant
);
restaurantRouter.put(
  "/:restaurantId",
  Authenticate,
  Authorize("ADMIN"),
  restaurantController.updateRestaurant
);
restaurantRouter.delete(
  "/:restaurantId",
  Authenticate,
  Authorize("ADMIN"),
  restaurantController.deleteRestaurant
);

restaurantRouter.get(
  "/:restaurantId/reviews",
  Authenticate,
  restaurantController.getRestaurantReviews
);
restaurantRouter.post(
  "/:restaurantId/reviews",
  Authenticate,
  Authorize("USER"),
  restaurantController.createReview
);
restaurantRouter.post(
  "/:restaurantId/notifications",
  Authenticate,
  Authorize("USER"),
  restaurantController.pushNotifications
);
export default restaurantRouter;
