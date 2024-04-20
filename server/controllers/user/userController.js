const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

const Recipe = require("../../models/Recipe");
const User = require("../../models/User");

const appError = require("../../utils/appError");
const {
  deleteFromCloudinary,
  uploadToCloudinary,
} = require("../../config/cloudinary");

const getUserProfileController = async (req, res, next) => {
  try {
    const userId = req.userAuth;
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "recipes",
        populate: { path: "creator", select: "name avatar" },
      });

    res.status(200).json({ message: "User data", data: user });
  } catch (err) {
    next(appError(err.message));
  }
};

const updateUserAvatarController = async (req, res, next) => {
  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    const userToUpdate = await User.findById(req.userAuth);

    if (!userToUpdate) {
      next(appError("User not Found", 404));
    }

    let newavatarURL;

    // Check if a new recipe photo is uploaded
    if (req.files && req.files.avatar) {
      const { avatar } = req.files;

      // Validate new photo size
      if (avatar.size > 500000) {
        formattedErrors.image = "Avatar should be less than 500KB";
        return res.status(500).json({ errors: formattedErrors });
      }

      // Delete old photo from Cloudinary
      if (userToUpdate.avatar) {
        await deleteFromCloudinary(userToUpdate.avatar);
      }

      // Upload new photo to Cloudinary
      newavatarURL = await uploadToCloudinary(avatar.tempFilePath);
    }

    await User.findByIdAndUpdate(
      req.userAuth,
      {
        avatar: newavatarURL,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Avatar updated successfully",
      newavatarURL,
    });
  } catch (err) {
    next(appError(err.message));
  }
};

const updateUserProfileController = async (req, res, next) => {
  const { name, email, password, cnfPassword } = req.body;

  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    const userToUpdate = await User.findById(req.userAuth);

    if (!userToUpdate) {
      next(appError("User not Found", 404));
    }

    let emailExists = false;
    if (email !== userToUpdate.email) {
      const newEmail = email.toLowerCase();
      emailExists = await User.findOne({ email: newEmail });
    }

    if (emailExists) {
      formattedErrors.email = "Email already in use";
      return res.status(500).json({ errors: formattedErrors });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      userToUpdate.password
    );

    if (!isPasswordMatch) {
      formattedErrors.password = "Incorrect password";
      return res.status(500).json({ errors: formattedErrors });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(req.userAuth, {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (!updatedUser) {
      return next(appError("Error in updating user", 500));
    }

    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (err) {
    next(appError(err.message));
  }
};

const getLikedRecipesController = async (req, res, next) => {
  try {
    const userId = req.userAuth;

    const likedRecipes = await Recipe.find({
      likes: { $in: [userId] },
    }).populate("creator", "name avatar");

    res.status(200).json({ message: "User recipes", data: likedRecipes });
  } catch (err) {
    next(appError(err.message));
  }
};

const getCreatorProfileController = async (req, res, next) => {
  try {
    const creatorId = req.params.creatorId;

    const creatorProfile = await User.findById(creatorId)
      .populate({
        path: "recipes",
        populate: { path: "creator", select: "name avatar" },
      })
      .select("-password");

    res.status(200).json({ message: "Creator profile", data: creatorProfile });
  } catch (err) {
    next(appError(err.message));
  }
};

const followUnfollowController = async (req, res, next) => {
  try {
    const actionUser = await User.findById(req.params.userId);

    if (!actionUser) {
      return next(appError("No user found", 404));
    }

    const currentUser = await User.findById(req.userAuth);

    if (!currentUser) {
      return next(appError("Current user not found", 404));
    }

    const isAlreadyFollowing = actionUser.followers.includes(req.userAuth);

    if (isAlreadyFollowing) {
      actionUser.followers.pull(req.userAuth);
      currentUser.following.pull(actionUser._id);
    } else {
      actionUser.followers.push(req.userAuth);
      currentUser.following.push(actionUser._id);
    }

    await actionUser.save();
    await currentUser.save();

    res.status(200).json({
      message: "Operation successful",
      followerCount: actionUser.followerCount,
    });
  } catch (err) {
    next(appError(err.message));
  }
};

module.exports = {
  getUserProfileController,
  updateUserAvatarController,
  getLikedRecipesController,
  getCreatorProfileController,
  updateUserProfileController,
  followUnfollowController,
};
