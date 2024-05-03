const handleFileChange = (
  event,
  setSelectedFile,
  setPreviewData,
  setDescription,
  setDescriptions
) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    setSelectedFile(files[0]);
    setDescription(null);
    setDescriptions([]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        // Create a URL object for the file
        const fileURL = URL.createObjectURL(files[0]);

        setPreviewData(fileURL);
      }
    };

    setPreviewData(null);
    reader.readAsDataURL(files[0]);
  }
};
export default handleFileChange;
