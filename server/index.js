const express = require("express");
const multer = require("multer");

const bcrypt = require("bcryptjs");

const connectDB = require("./db/connection");
const router = require("./controller/fileRoutes");
var cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
console.log(process.env.MONGODB_USERNAME);
console.log(process.env.OPENAI_API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.use("/api", router);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
