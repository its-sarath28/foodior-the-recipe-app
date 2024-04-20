const appError = require("../utils/appError");

require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const uploadToCloudinary = async (fileData) => {
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(fileData, {
      transformation: { width: 200, height: 200, crop: "fill" },
    });

    return cloudinaryResponse.secure_url;
  } catch (err) {
    console.log(err);
  }
};

const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public ID from the image URL
    const publicId = imageUrl.match(/\/v\d+\/([^/]+)\./)[1];

    // Delete the image from Cloudinary using the public ID
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Error deleting image from Cloudinary:", err);
  }
};

module.exports = { deleteFromCloudinary, uploadToCloudinary };
