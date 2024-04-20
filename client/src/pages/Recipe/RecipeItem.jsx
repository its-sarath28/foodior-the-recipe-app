import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Creator from "../../components/Creator";
import { UserContext } from "../../context/userContext";

const truncateContent = (content, maxLength) => {
  if (content.length > maxLength) {
    return content.substring(0, maxLength) + "...";
  }
  return content;
};

const RecipeItem = ({
  recipeId,
  title,
  category,
  content,
  recipeImageURL,
  recipePhoto,
  creator,
  createdAt,
  likeCount,
}) => {
  const { userId } = useContext(UserContext);

  const maxLength = 80;
  const truncatedContent = truncateContent(content, maxLength);

  const creatorId = creator ? creator._id : null;
  const creatorName = creator ? creator.name : null;
  const creatorAvatar = creator ? creator.avatar : null;

  return (
    <div className="p-2 lg:p-2 rounded-[10px] border border-sky-100 hover:shadow-2xl">
      <figure className="h-[10rem]">
        {recipePhoto ? (
          <img
            src={recipePhoto}
            alt="thumbnail"
            className="w-full rounded-md h-full object-cover"
          />
        ) : (
          <img
            src={recipeImageURL}
            alt="thumbnail"
            className="w-full rounded-md h-full object-cover"
          />
        )}
      </figure>

      <Link to={`/recipe/${recipeId}`}>
        <h2 className="text-[18px] lg:text-[24px] mt-4 font-[600] hover:underline">
          {title}
        </h2>
      </Link>

      <p
        className="text-gray-500"
        dangerouslySetInnerHTML={{ __html: truncatedContent }}
      ></p>

      <p className="my-2 text-gray-500">{likeCount} Likes</p>

      <div className="flex items-center justify-between">
        {creatorId === userId ? (
          <Link to={`/user/profile/me`}>
            <Creator
              creatorName={creatorName}
              creatorAvatar={creatorAvatar}
              createdAt={createdAt}
            />
          </Link>
        ) : (
          <Link to={`/recipes/creator/profile/${creatorId}`}>
            <Creator
              creatorName={creatorName}
              creatorAvatar={creatorAvatar}
              createdAt={createdAt}
            />
          </Link>
        )}
        <label className="border py-1 px-2 rounded bg-[#a492af] text-white text-[15px]">
          {category}
        </label>
      </div>
    </div>
  );
};

export default RecipeItem;
