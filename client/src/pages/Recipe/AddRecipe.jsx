import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { MdOutlineDeleteOutline } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

import "react-quill/dist/quill.snow.css";
import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const AddRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: "",
    category: "",
    recipePhoto: "",
    recipeImageURL: "",
    content: "",
    ingredients: [],
  });

  const [errors, setErrors] = useState({
    title: "",
    category: "",
    image: "",
    content: "",
    ingredients: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useContext(UserContext);

  const token = isLoggedIn;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    setRecipeData({ ...recipeData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setRecipeData({ ...recipeData, content });
  };

  const handleRecipeImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const addIngredients = (e) => {
    e.preventDefault();

    setRecipeData((prevRecipeData) => ({
      ...prevRecipeData,
      ingredients: [
        ...prevRecipeData.ingredients,
        {
          ingredientName: "",
          ingredientQuantity: "",
          ingredientUnit: "",
        },
      ],
    }));
  };

  const handleIngredientChange = (e, index) => {
    const { name, value } = e.target;

    setRecipeData((prevRecipeData) => {
      const updatedIngredients = [...prevRecipeData.ingredients];
      updatedIngredients[index][name] = value;

      return {
        ...prevRecipeData,
        ingredients: updatedIngredients,
      };
    });
  };

  const deleteIngredient = (e, index) => {
    e.preventDefault();
    const updatedIngredients = [...recipeData.ingredients];
    updatedIngredients.splice(index, 1);
    setRecipeData({ ...recipeData, ingredients: updatedIngredients });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "+1" },
        { indent: "-1" },
      ],
      ["link", "image"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const addRecipeHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const recipeDataToSend = new FormData();
      recipeDataToSend.append("title", recipeData.title);
      recipeDataToSend.append("category", recipeData.category);
      recipeDataToSend.append("content", recipeData.content);
      recipeDataToSend.append("recipeImageURL", recipeData.recipeImageURL);
      recipeDataToSend.append("recipePhoto", selectedFile);
      recipeDataToSend.append(
        "ingredients",
        JSON.stringify(recipeData.ingredients)
      );

      const response = await axios.post(
        `${BASE_URL}/recipes/create-recipe`,
        recipeDataToSend,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigate("/");
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(err);

      if (err.response && err.response.data && err.response.data.errors) {
        const { errors } = err.response.data;

        setErrors({
          title: errors.title || "",
          category: errors.category || "",
          image: errors.image || "",
          content: errors.content || "",
          ingredients: errors.ingredients || "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-[10px] md:px-[20px]">
      <form onSubmit={addRecipeHandler} className="max-w-[1170px] mx-auto">
        <div className="grid md:grid-cols-3 gap-[20px]">
          <div className="pb-[20px] rounded-md flex flex-col">
            <h4 className="text-start text-[22px] font-[600] mb-[20px]">
              Ingredients
            </h4>

            {recipeData.ingredients?.map((item, index) => (
              <div key={index}>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="ingredientName"
                      placeholder="Ingredient Name"
                      className="bg-[#ddd] rounded-md p-2 w-full focus:outline-none"
                      value={item.ingredientName}
                      onChange={(e) => handleIngredientChange(e, index)}
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="text"
                      name="ingredientQuantity"
                      placeholder="Quantity"
                      className="bg-[#ddd] rounded-md p-2 w-full focus:outline-none"
                      value={item.ingredientQuantity}
                      onChange={(e) => handleIngredientChange(e, index)}
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="text"
                      name="ingredientUnit"
                      placeholder="Unit"
                      className="bg-[#ddd] rounded-md p-2 w-full focus:outline-none"
                      value={item.ingredientUnit}
                      onChange={(e) => handleIngredientChange(e, index)}
                    />
                  </div>
                </div>

                <button
                  onClick={(e) => deleteIngredient(e, index)}
                  className=" mt-3 bg-red-600 text-white p-2 rounded-full text-[18px] mb-[10px]"
                >
                  <MdOutlineDeleteOutline />
                </button>
              </div>
            ))}

            <button
              onClick={addIngredients}
              className="bg-[#000] py-2 px-5 rounded text-white h-fit w-fit cursor-pointer mt-[15px]"
            >
              Add ingredient
            </button>

            {errors.ingredients && (
              <small className=" text-red-600">{errors.ingredients}</small>
            )}
          </div>

          <div className="md:col-span-2 ">
            <h3 className="text-start md:text-center text-[22px] font-[600] mb-[20px]">
              Reciepie Details
            </h3>
            <div className="mb-[30px] tetx-left">
              <input
                type="text"
                name="title"
                placeholder="Title"
                className={`${
                  errors.title
                    ? "bg-red-100 border border-red-600 placeholder:text-red-500"
                    : "bg-[#ddd]"
                } w-full p-3 rounded-md focus:outline-none`}
                value={recipeData.title}
                onChange={handleInputChange}
              />
              {errors.title && (
                <small className="text-red-600">{errors.title}</small>
              )}
            </div>

            <div className="mb-[30px]">
              <input
                type="text"
                name="category"
                placeholder="Category"
                className={`${
                  errors.category
                    ? "bg-red-100 border border-red-600 placeholder:text-red-500"
                    : "bg-[#ddd]"
                } w-full p-3 rounded-md focus:outline-none`}
                value={recipeData.category}
                onChange={handleInputChange}
              />
              {errors.category && (
                <small className="text-red-600">{errors.category}</small>
              )}
            </div>

            <div className="mb-[30px]">
              <div className=" grid grid-cols-2 gap-4 items-center ">
                <div className="flex items-center gap-3">
                  {previewURL && (
                    <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                      <img
                        src={previewURL}
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </figure>
                  )}

                  <div className="relative w-[130px] h-[50px]">
                    <input
                      type="file"
                      name="recipePhoto"
                      id="customFile"
                      accept=".jpg, .png, .jpeg"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleRecipeImageChange}
                    />

                    <label
                      htmlFor="customFile"
                      className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#ddd] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                    >
                      Upload photo
                    </label>
                  </div>
                </div>

                <div className="">
                  <input
                    type="url"
                    name="recipeImageURL"
                    placeholder="Image URL"
                    className="bg-[#ddd] w-full p-3 rounded-md focus: outline-none"
                    value={recipeData.imageURL}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {errors.image && (
                <small className="text-red-600">{errors.image}</small>
              )}
            </div>

            <div>
              {errors.content && (
                <small className="text-red-600">{errors.content}</small>
              )}
              <ReactQuill
                modules={modules}
                formats={formats}
                className="h-[25vh]"
                value={recipeData.content}
                onChange={handleContentChange}
                placeholder="Descripbe the making..."
              />
            </div>
          </div>
        </div>

        <div className="md:ml-auto mt-[100px] md:mt-[60px] md:w-fit">
          <button
            type="submit"
            className="py-2 px-4 bg-[#c8c8c8] rounded-md text-dark font-[600] outline-none"
          >
            {isLoading && !errors ? (
              <Loader size={25} color="#333" />
            ) : (
              `Add Recipe`
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddRecipe;
