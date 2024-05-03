import axios from "axios";

const handleUpload = async (
  selectedFile,
  setUploading,
  setFileDetails,
  setDescription,
  setDescriptions
) => {
  if (!selectedFile) return;
  setUploading(true);
  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await axios.post(
      "http://localhost:3000/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    const fileData = response.data.file_info;
    setFileDetails(fileData);

    // Check if the uploaded file is a video
    if (fileData.file_mimetype.startsWith("video")) {
      setDescriptions(response.data.openAIResponse);
    } else {
      setDescription(response.data.openAIResponse);
    }
  } catch (error) {
    console.error("Failed to upload file:", error);
  } finally {
    setUploading(false);
  }
};

export default handleUpload;
