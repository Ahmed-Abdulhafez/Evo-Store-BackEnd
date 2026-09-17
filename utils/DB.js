const mongoose = require("mongoose")

const url = process.env.MONGO_DB_URL

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(url);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error, "Database Connection Failed");
    process.exit();
  }
};
connectDb();

module.exports = connectDb