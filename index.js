const express = require("express");
const mongoose = require("mongoose");

const eventsRoutes = require("./routes/event.js");
const usersRoute = require("./routes/user.js");

const authMiddleware = require("./middleware/auth.js");

const app = express();

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://kumarAnunay:3AHQMnnn3KcZKV8B@cluster0.dnvzwtj.mongodb.net/"
  );
};

app.use(express.json());

app.use("/api/v1/event", authMiddleware, eventsRoutes);
app.use("/api/v1/user", usersRoute);

connectDb()
  .then(() => {
    console.log("Mongo DB connected Successfully");
  })
  .catch((err) => {
    console.log("Error connecting Mongo DB", err);
  });

const port = 5000;
app.listen(port, () => {
  console.log("Server is up and running on port", port);
});
