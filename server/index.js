const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const upload = require("express-fileupload");

require("dotenv").config();
require("./config/dbConnect");

//Import routes
const authRouter = require("./routes/auth/authRouter");
const userRouter = require("./routes/user/userRouter");
const recipeRouter = require("./routes/recipe/recipeRouter");

const globalErrorHandler = require("./middlewares/globalErrorHandler");

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://foodior-the-recipe-app.vercel.app",
    ],
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);
app.use(upload({ useTempFiles: true }));

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/recipes", recipeRouter);

//global errors
app.use(globalErrorHandler);

//404 Error
app.use("*", (req, res) => {
  res.status(404).json({
    message: `${req.originalUrl} - File not found`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});

module.exports = app;
