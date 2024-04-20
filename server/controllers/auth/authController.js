const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const User = require("../../models/User");

const generateToken = require("../../utils/generateToken");
const appError = require("../../utils/appError");
const { uploadToCloudinary } = require("../../config/cloudinary");

const signUpController = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if the fields are empty or not
  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    // console.log(req.files);

    const newEmail = email.toLowerCase();

    const userFound = await User.findOne({ email: newEmail });

    if (userFound) {
      formattedErrors.email = "Email already exists";
      return res.status(500).json({ errors: formattedErrors });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { avatar } = req.files;

    if (avatar.size > 500000) {
      formattedErrors.avatar = "Avatar should be less than 500KB";
      return res.status(500).json({ errors: formattedErrors });
    }

    const avatarUrl = await uploadToCloudinary(req.files?.avatar.tempFilePath);
    // console.log(avatarUrl);

    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    if (!newUser) {
      return next(appError("Error in creating new user", 500));
    }

    res.status(200).json({
      message: "Registered successfully",
      token: generateToken(newUser._id, newUser.role),
      userAvatar: newUser.avatar,
    });
  } catch (err) {
    next(appError(err));
  }
};

const signInController = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    const newEmail = email.toLowerCase();

    const userFound = await User.findOne({ email: newEmail });

    if (!userFound) {
      formattedErrors.general = "Invalid credentials";
      return res.status(500).json({ errors: formattedErrors });
    }

    const isPasswordMatch = await bcrypt.compare(password, userFound.password);

    if (!isPasswordMatch) {
      formattedErrors.general = "Invalid credentials";
      return res.status(500).json({ errors: formattedErrors });
    }

    res.status(200).json({
      message: "Logged in",
      token: generateToken(userFound._id, userFound.isAdmin),
      userAvatar: userFound.avatar,
      userId: userFound._id,
    });
  } catch (err) {
    next(appError(err.message));
  }
};

module.exports = { signUpController, signInController };
