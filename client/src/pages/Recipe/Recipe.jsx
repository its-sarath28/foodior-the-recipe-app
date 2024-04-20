import { useEffect, useState } from "react";
import axios from "axios";

import RecipeItem from "./RecipeItem";
import Loader from "../../components/Loader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Recipe = () => {
  const [recipe, setRecipe] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      setIsLoading(true);
      const getAllRecipes = async () => {
        const response = await axios.get(`${BASE_URL}/recipes`);

        if (response.status === 200) {
          setRecipe(response.data.data);
          // console.log(response.data.data);
        }
      };

      getAllRecipes();
    } catch (err) {
      console.log(`Error in getting recipes: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSearch = (e) => {
    let text = e.target.value;
    setSearch(text);
  };

  useEffect(() => {
    const searchRecipe = async () => {
      try {
        if (search.trim !== "") {
          setIsLoading(true);

          const response = await axios.get(
            `${BASE_URL}/recipes/search-recipe?recipeName=${search}`
          );

          if (response.status === 200) {
            setRecipe(response.data.data);
          }
        }
      } catch (err) {
        console.log(`Error in searching recipes: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    const timeOut = setTimeout(() => {
      searchRecipe();
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [search]);

  return (
    <>
      <section className="section bg-[#eeebe4]">
        <div className="container text-center">
          <div className=" max-w-[500px] bg-[#0066FF2C] mx-auto rounded-md flex items-center justify-between">
            <input
              type="search"
              placeholder="Search recipes..."
              className="p-4 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-black"
              onChange={onSearch}
            />
          </div>
        </div>
      </section>

      <section className="section px-[10px] md:px-[50px]">
        {isLoading && <Loader size={25} color="#333" />}

        {!isLoading && recipe?.length === 0 && (
          <p className="text-center font-[600] text-[22px]">
            No recipes found !
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {!isLoading &&
            recipe.map(
              ({
                _id: id,
                title,
                category,
                content,
                recipeImageURL,
                recipePhoto,
                creator,
                createdAt,
                likeCount,
              }) => (
                <RecipeItem
                  key={id}
                  recipeId={id}
                  title={title}
                  category={category}
                  content={content}
                  recipeImageURL={recipeImageURL}
                  recipePhoto={recipePhoto}
                  creator={creator}
                  createdAt={createdAt}
                  likeCount={likeCount}
                />
              )
            )}
        </div>
      </section>
    </>
  );
};

export default Recipe;
