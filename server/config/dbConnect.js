const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to DB`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

dbConnect();
