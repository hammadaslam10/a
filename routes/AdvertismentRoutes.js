const express = require("express");
const router = express.Router();
const { upload } = require("../Utils/ImageUpload");
const { CreateAdvertisment } = require("../controllers/AdvertismentController");
router.route("/ads", upload.single("image")).post(CreateAdvertisment);

module.exports = router;
