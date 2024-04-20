const { validationResult } = require("express-validator");

const appError = require("../../utils/appError");

const Recipe = require("../../models/Recipe");
const User = require("../../models/User");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../config/cloudinary");

const getAllRecipesController = async (req, res, next) => {
  try {
    const allRecipes = await Recipe.find({})
      .populate("creator")
      .populate({
        path: "creator",
        select: "name avatar",
      })
      .sort({ createdAt: 1 });

    res.status(200).json({ message: "All recipes", data: allRecipes });
  } catch (err) {
    next(appError(err.message));
  }
};

const createRecipeController = async (req, res, next) => {
  const { title, category, content, recipeImageURL, ingredients } = req.body;
  const formattedIngrredients = JSON.parse(ingredients);

  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    // if (req.file?.recipePhoto) {
    const { recipePhoto } = req.files;

    if (recipePhoto.size > 500000) {
      formattedErrors.image = "Recipe Photo should be less than 500KB";
      return res.status(500).json({ errors: formattedErrors });
    }

    console.log(recipePhoto);

    const recipeImageUrl = await uploadToCloudinary(
      req.files?.recipePhoto.tempFilePath
    );

    const newRecipe = await Recipe.create({
      title,
      category,
      content,
      recipeImageURL,
      recipePhoto: recipeImageUrl,
      creator: req.userAuth,
      ingredients: formattedIngrredients,
    });

    if (!newRecipe) {
      return next(appError("Error in creating new recipe"));
    }

    await User.findByIdAndUpdate(req.userAuth, {
      $push: { recipes: newRecipe._id },
    });

    res.status(200).json({
      message: "Recipe created successfully",
    });
    // }
  } catch (err) {
    next(appError(err.message));
  }
};

const getSingleRecipeController = async (req, res, next) => {
  try {
    const singleRecipe = await Recipe.findById(req.params.recipeId).populate(
      "creator",
      "name avatar"
    );

    if (!singleRecipe) {
      return next(appError("Recipe not found", 404));
    }

    res.status(200).json({
      message: "Single recipe",
      data: singleRecipe,
    });
  } catch (err) {
    next(appError(err.message));
  }
};

const updateRecipeController = async (req, res, next) => {
  const { title, category, content, recipeImageURL, ingredients } = req.body;

  // console.log(ingredients);
  const formattedIngrredients = JSON.parse(ingredients);

  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    const recipeToUpdate = await Recipe.findById(req.params.recipeId);

    if (!recipeToUpdate) {
      return next(appError("Recipe not found", 404));
    }

    if (recipeToUpdate.creator.toString() !== req.userAuth.toString()) {
      return next(appError("Action not allowed", 403));
    }

    let newRecipePhotoURL = recipeToUpdate.recipePhoto;

    // Check if a new recipe photo is uploaded
    if (req.files && req.files.recipePhoto) {
      const { recipePhoto } = req.files;

      // Validate new photo size
      if (recipePhoto.size > 500000) {
        formattedErrors.image = "Recipe Photo should be less than 500KB";
        return res.status(500).json({ errors: formattedErrors });
      }

      // Delete old photo from Cloudinary
      if (recipeToUpdate.recipePhoto) {
        await deleteFromCloudinary(recipeToUpdate.recipePhoto);
      }

      // Upload new photo to Cloudinary
      newRecipePhotoURL = await uploadToCloudinary(recipePhoto.tempFilePath);
    }

    await Recipe.findByIdAndUpdate(
      req.params.recipeId,
      {
        title,
        category,
        content,
        recipeImageURL,
        recipePhoto: newRecipePhotoURL,
        ingredients: formattedIngrredients,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Recipe updated successfully",
    });
  } catch (err) {
    next(appError(err.message));
  }
};

const deleteRecipeController = async (req, res, next) => {
  try {
    const recipeToDelete = await Recipe.findById(req.params.recipeId);

    if (!recipeToDelete) {
      return next(appError("Recipe not found", 404));
    }

    if (recipeToDelete.creator.toString() !== req.userAuth.toString()) {
      return next(appError("Action not allowed", 403));
    }

    await User.findByIdAndUpdate(
      req.userAuth,
      {
        $pull: { recipes: req.params.recipeId },
      },
      { new: true }
    );

    if (recipeToDelete.recipePhoto) {
      await deleteFromCloudinary(recipeToDelete.recipePhoto);
    }

    await Recipe.findByIdAndDelete(req.params.recipeId);

    res.status(200).json({ message: "Recipe deleted successfuly" });
  } catch (err) {
    next(appError(err.message));
  }
};

const toggleLikeRecipeController = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    const isLiked = recipe.likes.includes(req.userAuth);

    if (isLiked) {
      recipe.likes = recipe.likes.filter(
        (like) => like.toString() !== req.userAuth.toString()
      );
      await recipe.save();
    } else {
      recipe.likes.push(req.userAuth);
      await recipe.save();
    }

    res.status(200).json({ message: "Recipe like" });
  } catch (err) {
    next(appError(err.message));
  }
};

const searchRecipeController = async (req, res, next) => {
  try {
    const { recipeName } = req.query;

    // console.log(recipeName);

    const searchResults = await Recipe.find({
      title: { $regex: recipeName, $options: "i" },
    }).populate("creator", "name avatar");

    // console.log(searchResults);

    res.json({
      message: "Getting search results",
      data: searchResults,
    });
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

module.exports = {
  getAllRecipesController,
  createRecipeController,
  getSingleRecipeController,
  updateRecipeController,
  deleteRecipeController,
  toggleLikeRecipeController,
  searchRecipeController,
};
