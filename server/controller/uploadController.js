const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const OpenAI = require("openai");
const ffmpeg = require("fluent-ffmpeg");

const client = new OpenAI({
  apiKey: "your-gpt-key",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    const filename = uuidv4() + "-" + file.originalname; // Generate a unique filename
    cb(null, filename);
  },
});

const upload = multer({ storage });

const uploadFileHandler = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "Multer error", error: err });
      } else if (err) {
        return res.status(500).json({ message: "Error", error: err });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Check if the uploaded file is an image or video
      const isImage = req.file.mimetype.startsWith("image");
      const isVideo = req.file.mimetype.startsWith("video");

      if (isImage) {
        // Process image
        const openAIResponse = await sendOpenAIRequestForImage(req.file.path);
        return res.status(200).json({
          message: "Image uploaded successfully",
          openAIResponse: openAIResponse,
        });
      } else if (isVideo) {
        // Process video
        const frameFiles = await processVideo(req.file.path);
        const openAIResponse = await sendOpenAIRequestForVideo(frameFiles);
        return res.status(200).json({
          message: "Video uploaded successfully",
          openAIResponse: openAIResponse,
        });
      } else {
        // Unsupported file type
        return res.status(400).json({ message: "Unsupported file type" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to upload file", error: error.message });
    }
  });
};

const sendOpenAIRequestForImage = async (imagePath) => {
  try {
    const fileContent = fs.readFileSync(imagePath);
    const base64Image = Buffer.from(fileContent).toString("base64");

    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: "What’s in this image?" },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64Image}` },
          },
        ],
      },
    ];

    const params = {
      model: "gpt-4-turbo",
      messages,
    };

    const response = await client.chat.completions.create(params);
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error("Failed to send request to OpenAI API: " + error.message);
  }
};

const processVideo = async (videoPath) => {
  return new Promise((resolve, reject) => {
    const frameFiles = [];
    ffmpeg(videoPath)
      .on("filenames", (filenames) => {
        filenames.forEach((filename) => {
          frameFiles.push(`frames/${filename}`);
        });
      })
      .on("end", () => {
        resolve(frameFiles);
      })
      .on("error", (err) => {
        reject(err);
      })
      .screenshots({
        folder: "frames/",
        filename: "frame-0001_1.png",
        timestamps: ["10%", "20%", "30%", "40%", "50%"],
      });
  });
};

const sendOpenAIRequestForVideo = async (frameFiles) => {
  try {
    const descriptions = [];
    for (const frameFile of frameFiles) {
      const description = await generateDescription(frameFile);
      descriptions.push(description);
    }
    return descriptions;
  } catch (error) {
    throw new Error("Failed to send request to OpenAI API: " + error.message);
  }
};

const generateDescription = async (frameFile) => {
  const fileContent = fs.readFileSync(frameFile);
  const base64Image = Buffer.from(fileContent).toString("base64");

  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: "What’s in this video frame?" },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${base64Image}` },
        },
      ],
    },
  ];

  const params = {
    model: "gpt-4-turbo",
    messages,
  };

  const response = await client.chat.completions.create(params);
  return response.choices[0].message.content;
};

module.exports = {
  uploadFileHandler,
};
