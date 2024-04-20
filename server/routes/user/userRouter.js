const express = require("express");
const userRouter = express.Router();

const isLoggedIn = require("../../middlewares/isLoggedIn");

const {
  getUserProfileController,
  updateUserAvatarController,
  getLikedRecipesController,
  getCreatorProfileController,
  updateUserProfileController,
  followUnfollowController,
} = require("../../controllers/user/userController");
const { check, body } = require("express-validator");

//GET: /api/v1/users/profile => Get user profile
userRouter.get("/profile", isLoggedIn, getUserProfileController);

//PUT: /api/v1/users/update-avatar => Update the user's avatar
userRouter.put(
  "/update-avatar",
  [
    check("avatar").custom((value, { req }) => {
      if (!req.files?.avatar) {
        throw new Error("Avatar is required");
      }
      return true;
    }),
  ],
  isLoggedIn,
  updateUserAvatarController
);

//PUT: /api/v1/users/update-user => Update the user's data
userRouter.put(
  "/update-user",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .matches(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
      .withMessage(
        "Name must only contain letters with spaces only in the middle"
      )
      .isLength({ min: 3 })
      .withMessage("Name should be atleast 3 characters long"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Enter a valid email"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    // .isLength({ min: 6 })
    // .withMessage("Password should have minimum of 6 characters"),
    body("cnfPassword")
      .trim()
      .notEmpty()
      .withMessage("Confirmation password is required")
      .custom((value, { req }) => {
        if (req.body.password !== value) {
          throw new Error("Passwords do not match");
        }

        return true;
      }),
  ],
  isLoggedIn,
  updateUserProfileController
);

//GET: /api/v1/users/liked-recipes => Get all liked recipes of loggedin user
userRouter.get("/liked-recipes", isLoggedIn, getLikedRecipesController);

//GET: /api/v1/users/creator-profile/:creatorId => Get creator profile
userRouter.get("/creator-profile/:creatorId", getCreatorProfileController);

//GET: /api/v1/users/follow-unfollow/:userId => Get creator profile
userRouter.get(
  "/follow-unfollow/:userId",
  isLoggedIn,
  followUnfollowController
);

module.exports = userRouter;
