import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import Restaurant from "../models/restaurant.js";
import Booking from "../models/booking.js";
import User from "../models/user.js";
import Review from "../models/review.js";
async function createRestaurant(req, res) {
  try {
    const { originalname, path, size } = req.file;
    const options = {
      resource_type: "image",
      public_id: originalname,
      folder: "restaurants",
    };
    //upload to cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      // Write the buffer to the stream
      uploadStream.end(req.file.buffer);
    });
    const secure_url = result.secure_url;
    const restaurantObj = {
      adminId: req.user._id,
      ...req.body,
      address: JSON.parse(req.body.address),
      menu: JSON.parse(req.body.menu),
      tags: JSON.parse(req.body.tags),
      imageUrl: secure_url,
    };

    const findRestaurant = await Restaurant.find({ adminId: req.user._id });
    if (findRestaurant.length === 0) {
      const restaurant = await Restaurant.create(restaurantObj);
      res.status(201).json(restaurant);
    } else {
      res
        .status(400)
        .json({ error: "Account already has a registered restaurant" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occured while creating restaurant" });
  }
}
async function getRestaurants(req, res) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    const restaurants = await Restaurant.find({}).skip(skip).limit(limit);
    const totalRestaurants = await Restaurant.countDocuments();
    res.status(200).json({ restaurants, totalRestaurants, page, limit });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while fetching restaurant." });
  }
}
async function getRestaurantById(req, res) {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    res.status(200).json(restaurant);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ error: "Invalid restaurant id" });
    } else {
      res
        .status(500)
        .json({ error: "An error occured while fetching restaurant." });
    }
  }
}
async function updateRestaurant(req, res) {
  try {
    const { restaurantId } = req.params;
    console.log(req.body);
    const { name, address, about, phone, days, hours, menu, tags } = req.body;

    let isUpdate = false;
    let updatedRestaurant;
    if (name !== "") {
      updatedRestaurant = await Restaurant.updateOne(
        { _id: restaurantId },
        { $set: { name: name } }
      );
      isUpdate = true;
    }
    if (address.length > 0) {
      updatedRestaurant = await Restaurant.updateOne(
        { _id: restaurantId },
        { $set: { address: address } }
      );
      isUpdate = true;
    }
    if (about !== "") {
      updatedRestaurant = await Restaurant.updateOne(
        { _id: restaurantId },
        { $set: { about: about } }
      );
      isUpdate = true;
    }
    if (typeof phone !== "undefined" && phone) {
      updatedRestaurant = await Restaurant.updateOne(
        { _id: restaurantId },
        { $set: { phone: phone } }
      );
      isUpdate = true;
    }
    if (days !== "") {
      updatedRestaurant = await Restaurant.updateOne(
        { _id: restaurantId },
        { $set: { days: days } }
      );
      isUpdate = true;
    }
    if (hours !== "") {
      updatedRestaurant = await Restaurant.updateOne(
        { _id: restaurantId },
        { $set: { hours: hours } }
      );
      isUpdate = true;
    }
    if (menu.length > 0) {
      updatedRestaurant = await Restaurant.updateOne(
        { _id: restaurantId },
        { $set: { menu: menu } }
      );
      isUpdate = true;
    }
    if (tags.length > 0) {
      updatedRestaurant = await Restaurant.updateOne(
        { _id: restaurantId },
        { $set: { tags: tags } }
      );
      isUpdate = true;
    }
    if (isUpdate) {
      res.status(201).json(updatedRestaurant);
    } else {
      res.status(400).json({ error: "Nothing to update." });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occured while updating restaurant." });
  }
}
async function deleteRestaurant(req, res) {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    const filename = restaurant.imageUrl.substring(
      restaurant.imageUrl.lastIndexOf("/") + 1
    );
    const id = filename.slice(0, filename.lastIndexOf("."));

    cloudinary.uploader.destroy(`restaurants/${id}`, function (error, result) {
      console.log(result, error);
    });
    const deleteBookings = await Booking.deleteMany({
      restaurantId: restaurantId,
    });
    const deleteReviews = await Review.deleteMany({
      restaurantId: restaurantId,
    });
    const deleteRestaurant = await Restaurant.deleteOne({ _id: restaurantId });
    res.status(200).json(deleteRestaurant);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while deleting restaurant." });
  }
}
async function getRestaurantBookings(req, res) {
  try {
    const { restaurantId } = req.params;
    const result = await Booking.find({ restaurantId: restaurantId });
    const bookings = await Promise.all(
      result.map(async (booking) => {
        const [user] = await User.find({ _id: booking.userId });
        return {
          _id: booking._id,
          restaurantId: booking.restaurantId,
          userId: booking.userId,
          day: booking.day,
          hour: booking.hour,
          guest: booking.guest,
          status: booking.status,
          name: user.name,
          surname: user.surname,
          email: user.email,
        };
      })
    );

    res.status(200).json({ bookings });
  } catch (error) {
    console;
    res
      .status(500)
      .json({ error: "An error occured while fetching restaurant. bookings" });
  }
}
async function createBooking(req, res) {
  try {
    const { restaurantId } = req.params;
    const { day, hour, guest } = req.body;
    const result = await Booking.find({ restaurantId: restaurantId });
    //check availability
    let isAvailable = true;
    result.map(async (booking) => {
      if (booking.day === day) {
        if (booking.hour === hour) {
          isAvailable = false;
        }
      }
    });
    if (isAvailable) {
      const booking = await Booking.create({
        restaurantId,
        userId: req.user._id,
        day,
        hour,
        guest,
      });

      res.status(200).json({ message: "Booking has been successfully made" });
    } else {
      console.log("un");
      res.status(400).json({ message: "Booking time is not available" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured while creating booking." });
  }
}
async function updateBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    console.log({ status });
    if (status) {
      const updatedBooking = await Booking.updateOne(
        { _id: bookingId },
        { $set: { status: status } }
      );

      res
        .status(200)
        .json({ message: "Booking has been successfully updated" });
    } else {
      console.log("un");
      res.status(400).json({ message: "Booking not updated" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured while creating booking." });
  }
}

async function getRestaurantReviews(req, res) {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.find({
      restaurantId: restaurantId,
    });
    console.log({ restaurantId, reviews });

    res.status(200).json({ reviews });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while fetching restaurant reviews." });
  }
}
async function createReview(req, res) {
  try {
    const { restaurantId } = req.params;
    const { rating, text } = req.body;
    const result = await Review.find({
      restaurantId: restaurantId,
      userId: req.user._id,
    });

    if (result.length === 0) {
      const review = await Review.create({
        restaurantId,
        userId: req.user._id,
        rating,
        text,
      });
      res.status(200).json({ message: "Review has been successfully made" });
    } else {
      res
        .status(400)
        .json({ message: "An review for the restaurant already exists" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occured while creating review" });
  }
}
async function pushNotifications(req, res) {
  const { restaurantId } = req.params;
  const { notifications } = req.body;

  //find restaurant admin
  const [restaurant] = Restaurant.find({ restaurantId: restaurantId });

  const updatedUserNotification = await User.updateOne(
    { _id: restaurant.adminId },
    { $set: { notifications: notifications } }
  );
  res.status(201).json(updatedUserNotification);
}
export default {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantBookings,
  createBooking,
  getRestaurantReviews,
  createReview,
  pushNotifications,
  updateBooking,
};
