import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cnfPassword: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    cnfPassword: "",
    avatar: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { setIsLoggedIn, setAvatar } = useContext(UserContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const signUpHandler = async (e) => {
    e.preventDefault();

    // console.log(formData);

    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("cnfPassword", formData.cnfPassword);
      formDataToSend.append("avatar", selectedFile);

      const response = await axios.post(
        `${BASE_URL}/auth/sign-up`,
        formDataToSend
      );

      if (response.status === 200) {
        const { token, userAvatar } = response.data;

        setIsLoggedIn(token);
        setAvatar(userAvatar);

        navigate("/");

        toast.success("Account created successfully!");
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
          avatar: errors.avatar || "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-[20px]">
      <div className=" min-h-[80vh] flex flex-col items-center justify-center">
        <form
          onSubmit={signUpHandler}
          className=" shadow-lg p-3 rounded-md w-[100%] md:w-[600px] text-center"
        >
          <div className="mb-[20px]">
            <h1 className="font-[600] text-[28px] mb-[5px]">
              Create an account
            </h1>
            <p className="">Fill in your details</p>
          </div>

          <div className="mb-[15px] text-left">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className={`${
                errors.name
                  ? "bg-red-100 border border-red-600 placeholder:text-red-500"
                  : "bg-[#ddd]"
              } w-full p-3 rounded-md focus:outline-none`}
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && (
              <small className="text-red-600">{errors.name}</small>
            )}
          </div>

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

          <div className="mb-[15px] text-left">
            <input
              type="password"
              name="cnfPassword"
              placeholder="Confirm password"
              className={`${
                errors.cnfPassword
                  ? "bg-red-100 border border-red-600 placeholder:text-red-500"
                  : "bg-[#ddd]"
              } w-full p-3 rounded-md focus:outline-none`}
              value={formData.cnfPassword}
              onChange={handleInputChange}
            />
            {errors.cnfPassword && (
              <small className=" text-red-600">{errors.cnfPassword}</small>
            )}
          </div>

          <div className="mb-5 flex  items-center gap-3">
            {previewURL && (
              <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                <img
                  src={previewURL}
                  alt="avatar"
                  className=" h-full w-full object-cover rounded-full"
                />
              </figure>
            )}

            <div className="relative w-[130px] h-[50px]">
              <input
                type="file"
                name="avatar"
                id="customFile"
                accept=".jpg, .png, .jpeg"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileInputChange}
              />

              <label
                htmlFor="customFile"
                className={`${
                  errors.avatar
                    ? "bg-red-100 border border-red-600 text-red-500"
                    : "bg-[#ddd] text-headingColor"
                }absolute top-0 left-0 w-full h-full
                     flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden  font-semibold rounded-lg truncate cursor-pointer`}
              >
                Upload photo
              </label>
            </div>
            {errors.avatar && (
              <small className=" text-red-600 text-start">
                {errors.avatar}
              </small>
            )}
          </div>

          <button className="bg-[#ddd] p-2.5 rounded-md w-full md:w-fit font-[600]">
            {isLoading ? <Loader size={25} color="#333" /> : `Register`}
          </button>
        </form>
        <p className="text-center text-[16px]">
          Already have an account?{" "}
          <Link to={"/auth/sign-in"} className="text-sky-600">
            Login.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
