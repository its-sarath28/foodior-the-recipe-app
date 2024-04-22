import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdCameraAlt } from "react-icons/md";
import toast from "react-hot-toast";

import MyRecipes from "./MyRecipes";
import ProfileSettings from "../User/ProfileSettings";

import LikedRecipes from "./LikedRecipes";
import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Dashboard = () => {
  const [userData, setUserData] = useState("");
  const [tab, setTab] = useState("myRecipes");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const [avatarError, setAvatarError] = useState("");

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    } else {
      const getUserData = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${BASE_URL}/users/profile`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            setUserData(response.data.data);
            // console.log(response.data);
          }
        } catch (err) {
          console.log(`Error in getting user profile: ${err}`);
        } finally {
          setIsLoading(false);
        }
      };

      getUserData();
    }
  }, [token, navigate]);

  const updateAvatarHandler = async (e) => {
    e.preventDefault();

    try {
      setAvatarLoading(true);
      const avatarData = new FormData();
      avatarData.append("avatar", selectedFile);

      const response = await axios.put(
        `${BASE_URL}/users/update-avatar`,
        avatarData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);

        // console.log(response.data);
        localStorage.setItem(
          "avatar",
          JSON.stringify(response.data.newavatarURL)
        );
        navigate(0);
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data && err.response.data.errors) {
        const { errors } = err.response.data;

        setAvatarError({
          image: errors.image || "",
        });
      }
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <section className="px-[10px] md:px-[20px]">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid md:grid-cols-3 gap-[20px]">
          <div className="pb-[20px] rounded-md">
            <div className="flex flex-col items-center justify-center ">
              {isLoading && (
                <div className="w-[150px] h-[150px] flex items-center justify-center rounded-full border-2 border-solid p-1">
                  <Loader size={25} color="#333" />
                </div>
              )}

              {!previewURL && userData?.avatar && (
                <figure className="w-[150px] h-[150px] rounded-full border-2 border-solid p-1">
                  <img
                    src={userData?.avatar}
                    alt="profile"
                    className="w-full rounded-full h-full object-cover"
                  />
                </figure>
              )}

              {previewURL && (
                <figure className="w-[150px] h-[150px] rounded-full border-2 border-solid p-1">
                  <img
                    src={previewURL}
                    alt="profile"
                    className="w-full rounded-full h-full object-cover"
                  />
                </figure>
              )}

              <form className="my-[20px] flex items-center gap-2">
                <div>
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  {/* {!previewURL && ( */}
                  <label htmlFor="avatar" className="cursor-pointer">
                    <MdCameraAlt className=" bg-slate-600 text-[40px] rounded-full text-white p-2 hover:text-black hover:bg-transparent hover:border-2 hover:border-black" />
                  </label>
                  {/* )} */}
                </div>

                {previewURL && (
                  <button
                    onClick={updateAvatarHandler}
                    className="bg-[#ddd] py-2 px-2.5 rounded-md font-[600]"
                  >
                    {avatarLoading ? (
                      <Loader size={25} color="#333" />
                    ) : (
                      "Update avatar"
                    )}
                  </button>
                )}
              </form>

              {avatarError.image && (
                <small className="text-red-600">{avatarError.image}</small>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-[18px] font-[600] leading-5">
                {userData.name}
              </h3>

              <p className="text-[15px] leading-5 font-medium text-gray-500">
                {userData.email}
              </p>
            </div>
            <div className="mt-[20px] grid grid-cols-3 gap-[10px]">
              <p className="text-[18px] flex flex-col text-center">
                {userData.recipeCount} <span>Posts</span>
              </p>
              <p className="text-[18px] flex flex-col text-center">
                {userData.followerCount} <span>Followers</span>
              </p>
              <p className="text-[18px] flex flex-col text-center">
                {userData.followingCount} <span>Following</span>
              </p>
            </div>
            <div className="mt-[20px]">
              <button
                onClick={() => navigate("/auth/logout")}
                className="w-[100%] bg-[#181A1E] border border-1 border-black p-3 text-[16px] leading-7 rounded-md text-white hover:bg-transparent hover:text-black"
              >
                Logout
              </button>
              {/* <button className="w-full bg-red-600 p-3 mt-5 text-[16px] leading-7 rounded-md text-white border border-1 border-red-600 hover:bg-transparent hover:text-red-600">
                Delete account
              </button> */}
            </div>
          </div>

          <div className="md:col-span-2 ">
            <div className="text-center md:text-start flex flex-col md:flex-row gap-[20px]">
              <button
                onClick={() => setTab("myRecipes")}
                className={` ${
                  tab === "myRecipes" && "bg-[#333] text-white"
                } p-2 px-5 rounded-md text-black font-semibold text-[16px] leading-7 border border-solid border-[#333]`}
              >
                My Blogs
              </button>

              <button
                onClick={() => setTab("settings")}
                className={`${
                  tab === "settings" && "bg-[#333] text-white"
                } p-2 px-5 rounded-md text-black font-semibold text-[16px] leading-7 border border-solid border-[#333]`}
              >
                Profile Settings
              </button>

              <button
                onClick={() => setTab("likedRecipes")}
                className={`${
                  tab === "likedRecipes" && "bg-[#333] text-white"
                } p-2 px-5 rounded-md text-black font-semibold text-[16px] leading-7 border border-solid border-[#333]`}
              >
                Liked Blogs
              </button>
            </div>

            {isLoading && (
              <div className="h-[57vh] flex items-center justify-center">
                <Loader size={25} color="#333" />
              </div>
            )}

            {tab === "myRecipes" && <MyRecipes recipes={userData.recipes} />}
            {tab === "settings" && <ProfileSettings userData={userData} />}
            {tab === "likedRecipes" && <LikedRecipes />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
