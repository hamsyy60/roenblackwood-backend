// app.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./src/routes/auth");
const cors = require("cors");

const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/colabapes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(`Database connection error: ${err.message}`));

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Route requests to /auth to the auth routes
app.use("/auth", authRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Internal Server Error" });
});

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
