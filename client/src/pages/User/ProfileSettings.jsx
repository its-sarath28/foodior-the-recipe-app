import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const UserProfile = ({ userData }) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    password: "",
    cnfPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    cnfPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { isLoggedIn } = useContext(UserContext);

  const token = isLoggedIn;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateUserHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const formDataToUpdate = { ...formData };

      const response = await axios.put(
        `${BASE_URL}/users/update-user`,
        formDataToUpdate,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate(0);
      }
    } catch (err) {
      console.log(err);

      if (err.response && err.response.data && err.response.data.errors) {
        const { errors } = err.response.data;

        setErrors({
          name: errors.name || "",
          email: errors.email || "",
          password: errors.password || "",
          cnfPassword: errors.cnfPassword || "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-[20px]">
      <h3 className="text-[24px] font-[600] text-center">Update Profile</h3>

      <form onSubmit={updateUserHandler} className="mt-[30px]">
        <div className="mb-[30px]">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            className="w-full border-b border-sky-500 text-[22px] p-3 focus:outline-none"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && (
            <small className=" text-red-600">{errors.name}</small>
          )}
        </div>

        <div className="mb-[30px]">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border-b border-sky-500 text-[22px] p-3 focus:outline-none"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <small className=" text-red-600">{errors.email}</small>
          )}
        </div>

        <div className="mb-[30px]">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border-b border-sky-500 text-[22px] p-3 focus:outline-none"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <small className=" text-red-600">{errors.password}</small>
          )}
        </div>

        <div className="mb-[30px]">
          <input
            type="password"
            name="cnfPassword"
            placeholder="Confirm password"
            className="w-full border-b border-sky-500 text-[22px] p-3 focus:outline-none"
            value={formData.cnfPassword}
            onChange={handleInputChange}
          />
          {errors.cnfPassword && (
            <small className=" text-red-600">{errors.cnfPassword}</small>
          )}
        </div>

        <div className="mt-7 text-center">
          <button
            type="submit"
            className="bg-[#ddd] p-2.5 rounded-md w-full  md:w-fit font-[600]"
          >
            {isLoading && !errors ? (
              <Loader size={25} color="#333" />
            ) : (
              `Update Profile`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
