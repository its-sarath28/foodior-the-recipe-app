const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipeImageURL: {
      type: String,
    },
    recipePhoto: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

recipeSchema.pre(/^find/, function (next) {
  recipeSchema.virtual("likeCount").get(function () {
    return this.likes?.length;
  });

  // recipeSchema.virtual("daysAgo").get(function () {
  //   const recipe = this;
  //   const date = new Date(recipe.createdAt);
  //   const daysAgo = Math.floor((Date.now() - date) / 86400000);
  //   return daysAgo === 0
  //     ? "Today"
  //     : daysAgo === 1
  //     ? "Yesterday"
  //     : recipe.createdAt;
  // });

  next();
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
