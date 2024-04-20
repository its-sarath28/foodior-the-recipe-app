const express = require("express");
const recipeRouter = express.Router();

const { body, check } = require("express-validator");

const isLoggedIn = require("../../middlewares/isLoggedIn");

const {
  createRecipeController,
  getSingleRecipeController,
  getAllRecipesController,
  updateRecipeController,
  deleteRecipeController,
  toggleLikeRecipeController,
  searchRecipeController,
} = require("../../controllers/recipe/recipeController");

//GET: /api/v1/recipes =>  GET all the recipes
recipeRouter.get("/", getAllRecipesController);

//GET: /api/v1/recipes/search-recipe =>  Search a recipe
recipeRouter.get("/search-recipe", searchRecipeController);

//GET: /api/v1/recipes/:recipeId =>  GET a single recipe
recipeRouter.get("/:recipeId", getSingleRecipeController);

//POST: /api/v1/recipes/create-recipe =>  Create a new recipe
recipeRouter.post(
  "/create-recipe",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title should be atleast 3 characters long"),
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isAlpha()
      .withMessage("Category must only contain letters")
      .isLength({ min: 3 })
      .withMessage("Category should be atleast 3 characters long"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    check("image").custom((value, { req }) => {
      if (!req.files?.recipePhoto && !req.body.recipeImageURL) {
        throw new Error("Recipe image / URL is required");
      }
      return true;
    }),
    body("ingredients").custom((value, { req }) => {
      // Check if the JSON field is provided in the request body
      if (!value) {
        throw new Error("JSON field is required");
      }

      // Parse the JSON string to an object
      const ingredients = JSON.parse(value);

      // Check if the parsed JSON is an array and it contains at least one element
      if (!Array.isArray(ingredients) || ingredients.length < 1) {
        throw new Error("At least one ingredient is required");
      }

      // Check each ingredient for the presence of name, quantity, and unit
      const isValidIngredients = ingredients.every(
        (ingredient) =>
          ingredient.ingredientName && ingredient.ingredientQuantity
      );

      if (!isValidIngredients) {
        throw new Error(
          "Each ingredient should contain atleast name and quantity"
        );
      }

      // Validation passed
      return true;
    }),
  ],
  isLoggedIn,
  createRecipeController
);

//PUT: /api/v1/recipes/edit-recipe/:recipeId =>  Edit a recipe
recipeRouter.put(
  "/edit-recipe/:recipeId",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title should be atleast 3 characters long"),
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isAlpha()
      .withMessage("Category must only contain letters")
      .isLength({ min: 3 })
      .withMessage("Category should be atleast 3 characters long"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    check("image").custom((value, { req }) => {
      if (
        !req.files?.recipePhoto &&
        !req.body.recipeImageURL &&
        !req.body.recipePhoto
      ) {
        throw new Error("Recipe image / URL is required");
      }
      return true;
    }),
    body("ingredients").custom((value, { req }) => {
      // Check if the JSON field is provided in the request body
      if (!value) {
        throw new Error("JSON field is required");
      }

      // Parse the JSON string to an object
      const ingredients = JSON.parse(value);

      // Check if the parsed JSON is an array and it contains at least one element
      if (!Array.isArray(ingredients) || ingredients.length < 1) {
        throw new Error("At least one ingredient is required");
      }

      // Check each ingredient for the presence of name, quantity, and unit
      const isValidIngredients = ingredients.every(
        (ingredient) =>
          ingredient.ingredientName && ingredient.ingredientQuantity
      );

      if (!isValidIngredients) {
        throw new Error(
          "Each ingredient should contain atleast name and quantity"
        );
      }

      // Validation passed
      return true;
    }),
  ],
  isLoggedIn,
  updateRecipeController
);

//DELETE: /api/v1/recipes/delete-recipe/:recipeId =>  Delete a recipe
recipeRouter.delete(
  "/delete-recipe/:recipeId",
  isLoggedIn,
  deleteRecipeController
);

//GET: /api/v1/recipes/likes/:recipeId =>  Like / Unlike a recipe
recipeRouter.get("/likes/:recipeId", isLoggedIn, toggleLikeRecipeController);

module.exports = recipeRouter;
