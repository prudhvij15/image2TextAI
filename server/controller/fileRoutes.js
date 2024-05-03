// routes/fileRoutes.js

const express = require("express");
const router = express.Router();
const uploadController = require("./uploadController");

router.post("/upload", uploadController.uploadFileHandler);

// router.get("/files/:id", fileController.getFile);

// router.delete("/files/:id", fileDeletion.deleteFile);

module.exports = router;
