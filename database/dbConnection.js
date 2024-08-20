import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "PORTFOLIO",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((e) => {
      console.log(`Some error occrured while connecting to database ${e}`);
    });
};

export default dbConnection;
