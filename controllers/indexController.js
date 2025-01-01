import User from "../models/user.js";
import Booking from "../models/booking.js";
import Review from "../models/review.js";
import Restaurant from "../models/restaurant.js";

import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 25 characters.";
const passLengthErr = "must be between 5 and 25 characters.";

const validateRegister = [
  body("name")
    .trim()
    .isAlpha()
    .withMessage(`Name ${alphaErr}`)
    .isLength({ min: 1, max: 25 })
    .withMessage(`Name ${lengthErr}`),
  body("surname")
    .trim()
    .isAlpha()
    .withMessage(`Surname ${alphaErr}`)
    .isLength({ min: 1, max: 25 })
    .withMessage(`Surname ${lengthErr}`),
  body("email").isEmail().withMessage("Not a valid e-mail address"),
  body("password")
    .isLength({ min: 5, max: 25 })
    .withMessage(`Password ${passLengthErr}`),
];

const userRegister = [
  validateRegister,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(500).json({
        errors: errors.array(),
      });
    }
    try {
      const { name, surname, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const findUser = await User.find({ email: email });
      if (findUser.length === 0) {
        const user = await User.create({
          name,
          surname,
          email,
          role,
          password: hashedPassword,
        });
        res.status(201).json({ message: "Registration successful" });
      } else {
        res.status(400).json({ error: "Email already in use" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occured during registration" });
    }
  },
];

async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.find({ email });
    if (user.length === 0) {
      return res.status(404).json({ message: "User does not exist." });
    }
    const match = await bcrypt.compare(password, user[0].password);

    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        userId: user[0]._id,
        email: user[0].email,
        role: user[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return res.status(200).json({
      message: "Auth Passed",
      token,
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occured while logging in." });
  }
}
async function getUser(req, res) {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ error: "Invalid user id" });
    } else {
      res.status(500).json({ error: "An error occured while fetching user." });
    }
  }
}
async function updateUser(req, res) {
  try {
    const userId = req.user._id;
    const { name, surname, email, password } = req.body;
    let isUpdate = false;
    let updatedUser;
    if (name !== "") {
      updatedUser = await User.updateOne(
        { _id: userId },

        { $set: { name: name } }
      );
      isUpdate = true;
    }
    if (surname !== "") {
      updatedUser = await User.updateOne(
        { _id: userId },

        { $set: { surname: surname } }
      );
      isUpdate = true;
    }
    if (email !== "") {
      updatedUser = await User.updateOne(
        { _id: userId },

        { $set: { email: email } }
      );
      isUpdate = true;
    }
    if (password !== "") {
      updatedUser = await User.updateOne(
        { _id: userId },

        { $set: { password: password } }
      );
      isUpdate = true;
    }
    if (isUpdate) {
      res.status(201).json(updatedUser);
    } else {
      res.status(400).json({ error: "Nothing to update." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occured while updating user." });
  }
}
async function pushNotifications(req, res) {
  const { userId, notifications } = req.body;

  const updatedUserNotification = await User.updateOne(
    { _id: userId },
    { $set: { notifications: notifications } }
  );
  res.status(201).json(updatedUserNotification);
}
async function getAdminResaurant(req, res) {
  try {
    const restaurant = await Restaurant.find({ adminId: req.user._id });
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
async function getUserReviews(req, res) {
  try {
    const reviews = await Review.find({
      userId: req.user._id,
    });

    res.status(200).json({ reviews });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while fetching user reviews." });
  }
}
async function getUserReviewById(req, res) {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    res.status(200).json(review);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ error: "Invalid review id" });
    } else {
      res
        .status(500)
        .json({ error: "An error occured while fetching review." });
    }
  }
}

async function updateReviewById(req, res) {
  try {
    const { reviewId } = req.params;
    const { rating, text } = req.body;
    let isUpdate = false;
    let updatedReview;
    if (typeof rating !== "undefined" && rating) {
      updatedReview = await Review.updateOne(
        { _id: reviewId },
        { $set: { rating: rating } }
      );
      isUpdate = true;
    }
    if (text !== "") {
      updatedReview = await Review.updateOne(
        { _id: reviewId },
        { $set: { text: text } }
      );
      isUpdate = true;
    }
    if (isUpdate) {
      res.status(201).json(updatedReview);
    } else {
      res.status(400).json({ error: "Nothing to update." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while fetching user reviews." });
  }
}
async function deleteReviewById(req, res) {
  const { reviewId } = req.params;

  const deleteReview = await Review.deleteOne({ _id: reviewId });
  res.status(200).json(deleteReview);
}

async function getUserBookings(req, res) {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    });

    res.status(200).json({ bookings });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while fetching user bookings." });
  }
}

export default {
  userRegister,
  userLogin,
  getUser,
  updateUser,
  pushNotifications,
  getAdminResaurant,
  getUserBookings,
  getUserReviews,
  getUserReviewById,
  updateReviewById,
  deleteReviewById,
};
