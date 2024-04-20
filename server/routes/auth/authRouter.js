const express = require("express");
const authRouter = express.Router();

const { body, check } = require("express-validator");
const {
  signUpController,
  signInController,
} = require("../../controllers/auth/authController");

authRouter.post(
  "/sign-up",
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
      .withMessage("Invalid email format"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should have minimum of 6 characters"),
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
    check("avatar").custom((value, { req }) => {
      if (!req.files || !req.files.avatar) {
        throw new Error("Avatar is required");
      }
      return true;
    }),
  ],
  signUpController
);

authRouter.post(
  "/sign-in",
  [
    body("email").trim().notEmpty().withMessage("Email is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  signInController
);

module.exports = authRouter;
