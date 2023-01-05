const mongoose = require("mongoose");

const AdvertismentSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: [true, "Please Enter Heading"]
  },
  text: {
    type: String,
    required: [true, "Please Enter Text"]
  },
  image: {
    type: String,
    required: true
  },
  imageurl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: [true, "Please Enter Caetgory"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Advertisment", AdvertismentSchema);
