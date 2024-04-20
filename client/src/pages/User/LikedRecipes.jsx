import { useContext, useEffect, useState } from "react";
import axios from "axios";
import RecipeItem from "../Recipe/RecipeItem";
import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const LikedRecipes = () => {
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;

  useEffect(() => {
    const getLikedRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/users/liked-recipes`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setLikedRecipes(response.data.data);
          // console.log(response.data);
        }
      } catch (err) {
        console.log(`Error getting liked recipes: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    getLikedRecipes();
  }, []);

  return (
    <div className="mt-[20px]">
      {isLoading && (
        <div className="h-[57vh] flex items-center justify-center">
          <Loader size={25} color="#333" />
        </div>
      )}

      {!isLoading && likedRecipes?.length === 0 && (
        <p className="text-center h-[57vh] flex items-center justify-center font-[600] text-[22px]">
          No recipes liked yet !
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
        {!isLoading &&
          likedRecipes?.map((recipes) => (
            <RecipeItem
              key={recipes._id}
              recipeId={recipes._id}
              title={recipes.title}
              category={recipes.category}
              content={recipes.content}
              recipeImageURL={recipes.recipeImageURL}
              recipePhoto={recipes.recipePhoto}
              creator={recipes?.creator}
              createdAt={recipes.createdAt}
              likeCount={recipes.likeCount}
            />
          ))}
      </div>
    </div>
  );
};

export default LikedRecipes;
