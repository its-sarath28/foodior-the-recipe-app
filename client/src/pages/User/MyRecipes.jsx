import RecipeItem from "../Recipe/RecipeItem";

const MyRecipes = ({ recipes }) => {
  return (
    <div className="mt-[20px]">
      {recipes?.length === 0 && (
        <p className="text-center h-[57vh] flex items-center justify-center font-[600] text-[22px]">
          No recipes created yet!
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
        {recipes?.map((recipes) => (
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

export default MyRecipes;
