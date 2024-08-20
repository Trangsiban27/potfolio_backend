import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { TimeLine } from "../models/timelineSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addTimeline = catchAsyncErrors(async (req, res, next) => {
  const { image } = req.files;

  if (!image) {
    return next(new ErrorHandler("Image not founded", 400));
  }

  const cloudinaryResponseImage = await cloudinary.uploader.upload(
    image.tempFilePath,
    { folder: "IMAGE_TIMELINE" }
  );

  if (!cloudinaryResponseImage || cloudinaryResponseImage.error) {
    console.error(
      "Cloudinary Error: ",
      cloudinaryResponseImage.error || "Unknow cloudinary Error"
    );
  }

  const { time, content, title } = req.body;

  if (!time || !content || !title) {
    return next(new ErrorHandler("Please fill full!", 400));
  }

  const timeline = await TimeLine.create({
    time,
    title,
    content,
    image: {
      public_id: cloudinaryResponseImage.public_id,
      url: cloudinaryResponseImage.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Add timeline successfully!",
    timeline,
  });
});

export const getAllTimline = catchAsyncErrors(async (req, res, next) => {
  const timeline = await TimeLine.find();

  res.status(200).json({
    success: true,
    timeline,
  });
});

export const updateTimeline = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    time: req.body.time,
    title: req.body.title,
    content: req.body.content,
  };

  if (req.files || req.files.image) {
    const image = req.files.image;

    const timeline = await TimeLine.findById(req.params.id);
    const imageId = timeline.image.public_id;
    await cloudinary.uploader.destroy(imageId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "IMAGE_TIMELINE",
      }
    );

    newData.image = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const timeline = await TimeLine.findOneAndUpdate(
    { _id: req.params.id },
    newData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Timeline Updated!",
    timeline,
  });
});

export const deleteTimeLine = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const timeline = await TimeLine.findById(id);

  await timeline.deleteOne();

  res.status(200).json({
    success: true,
    message: "Timeline Deleted!",
  });
});
