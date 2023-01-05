const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const AdvertismentModel = require("../models/AdvertismentModel");
const streamifier = require("streamifier");
exports.CreateAdvertisment = catchAsyncErrors(async (req, res, next) => {
  const { heading, text, category } = req.body;
  if (req.files.image == null) {
    return next(new ErrorHandler("Please upload an image", 404));
  }
  const file = req.files.image;
  console.log(file.data);
  //   const imageuploadresult = await cloudinary.v2.uploader.upload(file.data, {
  //     folder: "ads"
  //   });

  let cld_upload_stream = cloudinary.uploader.upload_stream(
    { folder: "test" },
    function (error, result) {
      console.log(result);
      res.json({ public_id: result.public_id, url: result.secure_url });
    }
  );

  streamifier.createReadStream(req.files.image.data).pipe(cld_upload_stream);

  //   console.log(imageuploadresult);
  //   const data = await AdvertismentModel.create({
  //     heading: heading,
  //     text: text,
  //     category: category,
  //     image: imageuploadresult.public_id,
  //     imageurl: imageuploadresult.secure_url
  //   });
  res.status(201).json({
    success: true,
    es: "message"
  });
});

exports.getAllAdvertisment = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 4;
  const AdvertismentCount = await AdvertismentModel.countDocuments();
  const apiFeature = new ApiFeatures(AdvertismentModel.find(), req.query)
    .search()
    .filter();

  let Advertisment = await apiFeature.query;
  let filteredAdvertismentCount = Advertisment.length;
  apiFeature.pagination(resultPerPage);

  Advertisment = await apiFeature.query;

  res.status(200).json({
    success: true,
    Advertisment,
    AdvertismentCount,
    resultPerPage,
    filteredAdvertismentCount
  });
});

exports.getAdvertismentModelDetails = catchAsyncErrors(
  async (req, res, next) => {
    const AdvertismentModel = await AdvertismentModel.findById(req.params.id);

    if (!AdvertismentModel) {
      return next(new ErrorHandler("AdvertismentModel Not found", 404));
    }

    res.status(200).json({
      success: true,
      AdvertismentModel
    });
  }
);

exports.getAdminAdvertismentModels = catchAsyncErrors(
  async (req, res, next) => {
    const AdvertismentModels = await AdvertismentModel.find();

    res.status(200).json({
      success: true,
      AdvertismentModels
    });
  }
);

exports.updateAdvertismentModel = catchAsyncErrors(async (req, res, next) => {
  let AdvertismentModel = await AdvertismentModel.findById(req.params.id);

  if (!AdvertismentModel) {
    return next(new ErrorHander("AdvertismentModel not found", 404));
  }

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < AdvertismentModel.images.length; i++) {
      await cloudinary.v2.uploader.destroy(
        AdvertismentModel.images[i].public_id
      );
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "AdvertismentModels"
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }

    req.body.images = imagesLinks;
  }

  AdvertismentModel = await AdvertismentModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false
    }
  );

  res.status(200).json({
    success: true,
    AdvertismentModel
  });
});

exports.deleteAdvertismentModel = catchAsyncErrors(async (req, res, next) => {
  const AdvertismentModel = await AdvertismentModel.findById(req.params.id);

  if (!AdvertismentModel) {
    return next(new ErrorHander("AdvertismentModel not found", 404));
  }

  for (let i = 0; i < AdvertismentModel.images.length; i++) {
    await cloudinary.v2.uploader.destroy(AdvertismentModel.images[i].public_id);
  }

  await AdvertismentModel.remove();

  res.status(200).json({
    success: true,
    message: "AdvertismentModel Delete Successfully"
  });
});
