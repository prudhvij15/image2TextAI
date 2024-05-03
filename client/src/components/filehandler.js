import React, { useState } from "react";
import handleFileChange from "./file";
import handleUpload from "./handleUpload";
const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [description, setDescription] = useState(null);
  const [descriptions, setDescriptions] = useState([]);
  const handleUploadClick = async () => {
    // Renamed function to handleUploadClick
    // Call handleUpload function with necessary parameters
    handleUpload(
      selectedFile,
      setUploading,
      setFileDetails,
      setDescription,
      setDescriptions
    );
  };

  return (
    <div className="container mx-auto gap-10 lg:w-3/4 xl:w-2/3">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-2">
          <h2 className="text-xl font-semibold mb-2">Upload File</h2>
          <div className="flex items-center mb-4">
            <input
              type="file"
              onChange={(event) =>
                handleFileChange(
                  event,
                  setSelectedFile,
                  setPreviewData,
                  setDescription,
                  setDescriptions
                )
              }
              className="mr-2"
            />
            <button
              onClick={handleUploadClick}
              disabled={!selectedFile || uploading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {fileDetails && (
            <div>
              <h2 className="text-xl font-semibold mb-2">File Details</h2>
              <p>Name: {fileDetails.file_name}</p>
              <a
                href={fileDetails.file_location}
                className="hover:text-gray-300"
              >
                <p>Size: {fileDetails.file_size} bytes</p>
              </a>
              <p>Type: {fileDetails.file_mimetype}</p>
            </div>
          )}
          {descriptions.length > 0 && (
            <div className="bg-gray-200 p-4 mt-4">
              <h2 className="text-2xl font-bold">Descriptions (Video)</h2>
              <div className="overflow-auto h-80">
                {descriptions.map((desc, index) => (
                  <p key={index}>{desc}</p>
                ))}
              </div>
            </div>
          )}
          {description && (
            <div className="bg-gray-200 p-4 mt-4">
              <h2 className="text-2xl font-bold">Description (Image)</h2>
              <div className="overflow-auto h-40">
                <p>{description}</p>
              </div>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="w-full lg:w-1/2 pl-0 lg:pl-2">
            <div className="bg-gray-300 h-[80vh] overflow-auto">
              <h2 className="text-xl font-semibold mb-2 text-black-100">
                Preview
              </h2>
              {previewData && (
                <div className="flex justify-center w-full">
                  {selectedFile.type.startsWith("image/") ? (
                    <img src={previewData} alt="Preview" className="w-auto" />
                  ) : (
                    <video controls className="w-auto">
                      <source src={previewData} type={selectedFile.type} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;
