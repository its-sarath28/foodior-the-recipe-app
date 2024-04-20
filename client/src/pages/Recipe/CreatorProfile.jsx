import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import RecipeItem from "./RecipeItem";

import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const CreatorProfile = () => {
  const [creatorData, setCreatorData] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { creatorId } = useParams();

  const { isLoggedIn, userId } = useContext(UserContext);

  const token = isLoggedIn;

  useEffect(() => {
    const getCreatorProfile = async () => {
      const response = await axios.get(
        `${BASE_URL}/users/creator-profile/${creatorId}`
      );

      if (response.status === 200) {
        setCreatorData(response.data.data);
        setIsFollowing(response.data.data.followers.includes(userId));
        // console.log(response.data.data);
      }
    };

    getCreatorProfile();
  }, []);

  const followUnFollowToggle = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/users/follow-unfollow/${creatorId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsFollowing(!isFollowing);

        const newFollowerCount = response.data.followerCount;
        setCreatorData((prevCreatorData) => ({
          ...prevCreatorData,
          followerCount: newFollowerCount,
        }));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-[10px] md:px-[20px]">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid md:grid-cols-3 gap-[20px]">
          <div className="pb-[20px] rounded-md">
            <div className="flex items-center justify-center">
              <figure className="w-[150px] h-[150px] rounded-full border-2 border-solid p-1">
                <img
                  src={creatorData?.avatar}
                  alt="profile"
                  className="w-full rounded-full h-full object-cover"
                />
              </figure>
            </div>

            <div className="text-center mt-4">
              <h3 className="text-[18px] font-[600] leading-5">
                {creatorData.name}
              </h3>

              <p className="text-[15px] leading-5 font-medium text-gray-500">
                {creatorData.email}
              </p>
            </div>

            <div className="mt-[20px] grid grid-cols-3 gap-[10px]">
              <p className="text-[18px] flex flex-col text-center">
                {creatorData.recipeCount} <span>Posts</span>
              </p>
              <p className="text-[18px] flex flex-col text-center">
                {creatorData.followerCount} <span>Followers</span>
              </p>
              <p className="text-[18px] flex flex-col text-center">
                {creatorData.followingCount} <span>Following</span>
              </p>
            </div>

            <div className="mt-[20px]">
              {isFollowing ? (
                <button
                  onClick={followUnFollowToggle}
                  className="w-full bg-[#181A1E] border border-1 border-black p-3 text-[16px] leading-7 rounded-md text-white "
                >
                  {isLoading ? <Loader size={25} color="#333" /> : `Unfollow`}
                </button>
              ) : (
                <button
                  onClick={followUnFollowToggle}
                  className="w-full bg-[#181A1E] border border-1 border-black p-3 text-[16px] leading-7 rounded-md text-white "
                >
                  {isLoading ? <Loader size={25} color="#333" /> : `Follow`}
                </button>
              )}
              {/* <button className="w-full bg-red-600 p-3 mt-5 text-[16px] leading-7 rounded-md text-white border border-1 border-red-600 hover:bg-transparent hover:text-red-600">
                Block
              </button> */}
            </div>
          </div>

          <div className="md:col-span-2 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
              {creatorData &&
              creatorData.recipes &&
              creatorData.recipes.length > 0 ? (
                creatorData.recipes.map((recipe) => (
                  <RecipeItem
                    key={recipe._id}
                    recipeId={recipe._id}
                    title={recipe.title}
                    category={recipe.category}
                    content={recipe.content}
                    recipeImageURL={recipe.recipeImageURL}
                    recipePhoto={recipe.recipePhoto}
                    creator={recipe.creator}
                    createdAt={recipe.createdAt}
                    likeCount={recipe.likeCount}
                  />
                ))
              ) : (
                <p className="text-center h-[57vh] flex items-center justify-center font-[600] text-[22px]">
                  No recipes created yet!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorProfile;
