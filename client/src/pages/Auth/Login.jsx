import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { setIsLoggedIn, setAvatar, setUserId } = useContext(UserContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signInHandler = async (e) => {
    e.preventDefault();

    // console.log(formData);

    try {
      setIsLoading(true);

      const response = await axios.post(`${BASE_URL}/auth/sign-in`, formData);

      if (response.status === 200) {
        const { token, userAvatar, userId } = response.data;

        setIsLoggedIn(token);
        setAvatar(userAvatar);
        setUserId(userId);

        navigate("/");

        toast.success("Logged in");
      }
    } catch (err) {
      console.log(err);

      if (err.response && err.response.data && err.response.data.errors) {
        const { errors } = err.response.data;

        setErrors({
          email: errors.email || "",
          password: errors.password || "",
          general: errors.general || "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full px-[20px]">
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <form
          onSubmit={signInHandler}
          className=" shadow-lg p-3 rounded-md w-[100%] md:w-[500px] text-center"
        >
          <div className="mb-[20px]">
            <h1 className="font-[600] text-[28px] mb-[10px]">Login</h1>
            <p>Fill in your credentials</p>
          </div>

          {errors.general && <p className=" text-red-600">{errors.general}</p>}

          <div className="mb-[15px] text-left">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className={`${
                errors.email
                  ? "bg-red-100 border border-red-600 placeholder:text-red-500"
                  : "bg-[#ddd]"
              } w-full p-3 rounded-md focus:outline-none`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <small className=" text-red-600">{errors.email}</small>
            )}
          </div>

          <div className="mb-[15px] text-left">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`${
                errors.password
                  ? "bg-red-100 border border-red-600 placeholder:text-red-500"
                  : "bg-[#ddd]"
              } w-full p-3 rounded-md focus:outline-none`}
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <small className=" text-red-600">{errors.password}</small>
            )}
          </div>

          <button className="bg-[#ddd] p-2.5 rounded-md w-full md:w-fit font-[600]">
            {isLoading && !errors ? <Loader size={25} color="#333" /> : `Login`}
          </button>
        </form>
        <p className="text-center text-[16px]">
          Dont have an account?{" "}
          <Link to={"/auth/sign-up"} className="text-sky-600">
            Create one.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
