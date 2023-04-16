const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// const userRoutes = require("./routes");
const userRoutes = require("./routes/userRoutes");
const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

// useNewUrlParser and useUnifiedTopology are options used in Mongoose to improve the connection process between the Node.js application and the MongoDB database by using a new URL parser and a new engine for handling replica set and sharded cluster connections.
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on PORT ${process.env.PORT}`);
});
