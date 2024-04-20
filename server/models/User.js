const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    // isBlocked: {
    //   type: Boolean,
    //   default: false,
    // },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Bloger"],
      default: "Bloger",
    },
    recipes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    // blocked: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

userSchema.virtual("recipeCount").get(function () {
  return this.recipes?.length;
});

userSchema.virtual("followerCount").get(function () {
  return this.followers?.length;
});

userSchema.virtual("followingCount").get(function () {
  return this.following?.length;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
