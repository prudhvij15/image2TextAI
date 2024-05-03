const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  //file_key: { type: String, required: true, trim: true },
  file_mimetype: { type: String, required: true, trim: true },
  file_location: { type: String, required: true, trim: true },
  file_name: { type: String, required: true, trim: true },
});

itemSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 * 24 * 15 });
const File = mongoose.model("File", itemSchema);

module.exports = mongoose.model("Item", itemSchema);
