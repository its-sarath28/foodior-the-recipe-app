import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";

import Creator from "../../components/Creator";
import Modal from "../../components/Modal";

import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const RecipeDetails = () => {
  const [recipeData, setRecipeData] = useState({
    creator: "",
    recipePhoto: "",
    recipeImageURL: "",
    title: "",
    content: "",
    ingredients: [],
    createdAt: "",
    likes: [],
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const [isLiked, setIsLiked] = useState(false);

  const { recipeId } = useParams();

  const navigate = useNavigate();

  const { isLoggedIn, userId } = useContext(UserContext);

  const token = isLoggedIn;

  useEffect(() => {
    try {
      setIsLoading(true);
      const getRecipeDetails = async () => {
        const response = await axios.get(`${BASE_URL}/recipes/${recipeId}`);

        if (response.status === 200) {
          setRecipeData(response.data.data);
          setIsLiked(response.data.data.likes.includes(userId));
          // console.log(response.data);
        }
      };

      getRecipeDetails();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleLike = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/recipes/likes/${recipeId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsLiked(!isLiked);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/recipes/delete-recipe/${recipeId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/");
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="section ">
      {isLoading && (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader size={25} color="#333" />
        </div>
      )}

      {!isLoading && (
        <div className="max-w-[1000px] mx-auto px-[20px] bg-gray-100 rounded-md py-[30px]">
          <div className="flex items-center justify-between">
            <Creator
              creatorName={recipeData?.creator.name}
              creatorAvatar={recipeData?.creator.avatar}
              createdAt={recipeData?.createdAt}
            />

            {token && userId === recipeData.creator._id && (
              <div className="flex gap-[15px]">
                <Link
                  to={`/edit-recipe/${recipeId}`}
                  className="border border-1 border-solid border-sky-600 px-2.5 py-1.5 rounded-md bg-sky-600 text-white hover:bg-transparent hover:text-sky-600"
                >
                  Edit
                </Link>
                <button
                  onClick={toggleOpen}
                  className="border border-1 border-solid border-red-600 px-2.5 py-1.5 rounded-md bg-red-600 text-white hover:bg-transparent hover:text-red-600"
                >
                  Delete
                </button>
                <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
                  <div className="flex flex-col">
                    <p className="font-[600] max-w-[300px] text-center">
                      Are you sure that you want to delete this recipe?
                    </p>

                    <div className="mt-5 flex justify-center gap-4">
                      <button className=" bg-slate-500 text-white px-3 py-2 rounded-md cursor-pointer">
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteRecipe}
                        className="bg-red-600 text-white px-3 py-2 rounded-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
            )}
          </div>

          <div className=" mt-[50px] px-[20px] md:px-[30px]">
            <div className="my-[20px]">
              <h2 className="text-[22px] xl:text-[26px] font-[600]">
                {recipeData.title}
              </h2>
            </div>

            <figure className="rounded-lg h-[20rem]">
              {recipeData?.recipePhoto ? (
                <img
                  src={recipeData.recipePhoto}
                  alt="thumbnail"
                  className="w-full rounded-md h-full object-cover"
                />
              ) : (
                <img
                  src={recipeData?.recipeImageURL}
                  alt="thumbnail"
                  className="w-full rounded-md h-full object-cover"
                />
              )}
            </figure>

            {token && userId && (
              <div className=" mt-6 ">
                {isLiked ? (
                  <FaHeart
                    size={25}
                    color="#f00"
                    className=" cursor-pointer"
                    onClick={handleToggleLike}
                  />
                ) : (
                  <FaRegHeart
                    size={25}
                    color="#f00"
                    className=" cursor-pointer"
                    onClick={handleToggleLike}
                  />
                )}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-[10px]">
              <div className=" col-span-2 p-2 rounded-md order-2 md:order-1">
                <h4 className="text-[22px] font-[600]">Instructions</h4>
                <hr className="mb-5" />

                <p dangerouslySetInnerHTML={{ __html: recipeData.content }}></p>
              </div>

              <div className="bg-stone-50 p-2 rounded-md h-fit order-1 md:order-2">
                <h4 className="text-[22px] font-[600]">Ingredients</h4>
                <hr className="mb-5" />

                {recipeData.ingredients.map((ingredient, index) => (
                  <div key={index} className="mb-1.5">
                    <p>
                      {ingredient.ingredientName}:{" "}
                      {ingredient.ingredientQuantity}{" "}
                      {ingredient.ingredientUnit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecipeDetails;
