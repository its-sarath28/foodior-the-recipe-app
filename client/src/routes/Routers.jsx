import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/User/Home";

import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Logout from "../pages/Auth/Logout";

import AddRecipe from "../pages/Recipe/AddRecipe";
import EditRecipe from "../pages/Recipe/EditRecipe";
import RecipeDetails from "../pages/Recipe/RecipeDetails";
import DeleteRecipe from "../pages/Recipe/DeleteRecipe";

import CreatorProfile from "../pages/Recipe/CreatorProfile";

import Dashboard from "../pages/User/Dashboard";
import Contact from "../pages/User/Contact";
import ErrorPage from "../pages/User/ErrorPage";

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/sign-in" element={<Login />} />
        <Route path="/auth/sign-up" element={<Signup />} />
        <Route path="/auth/logout" element={<Logout />} />
        <Route path="/create-recipe" element={<AddRecipe />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetails />} />
        <Route path="/edit-recipe/:recipeId" element={<EditRecipe />} />
        <Route path="/delete-blog/:recipeId" element={<DeleteRecipe />} />
        <Route path="/user/profile/me" element={<Dashboard />} />
        <Route
          path="/recipes/creator/profile/:creatorId"
          element={<CreatorProfile />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default Routers;
