import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { v2 as cloudinary } from "cloudinary";
import { Skill } from "../models/skillSchema.js";

export const addSkill = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Logo is required!", 400));
  }

  const { logo } = req.files;

  const cloudinaryResponseLogo = await cloudinary.uploader.upload(
    logo.tempFilePath,
    { folder: "LOGO_SKILL" }
  );

  if (!cloudinaryResponseLogo || cloudinaryResponseLogo.error) {
    console.error(
      "Cloudinary error: ",
      cloudinaryResponseLogo.error || "Unknow cloudinary error"
    );
  }

  const { name } = req.body;

  if (!name) {
    return next(new ErrorHandler("Name is requied!", 400));
  }

  const skill = await Skill.create({
    name,
    logo: {
      public_id: cloudinaryResponseLogo.public_id,
      url: cloudinaryResponseLogo.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Create Skill Successfully!",
    skill,
  });
});

export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    name: req.body.name,
  };

  if (req.files || req.files.logo) {
    const logo = req.files.logo;

    const skill = await Skill.findById(req.params.id);
    const logoId = skill.logo.public_id;
    await cloudinary.uploader.destroy(logoId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      logo.tempFilePath,
      { folder: "LOGO_SKILL" }
    );

    newData.logo = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const skill = await Skill.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Skill Updated!",
    skill,
  });
});

export const getAllSkill = catchAsyncErrors(async (req, res, next) => {
  const skill = await Skill.find();

  res.status(200).json({
    success: true,
    skill,
  });
});

export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params.id;

  const skill = await Skill.findById(id);

  await skill.deleteOne();

  res.status(200).json({
    success: true,
    message: "Skill Deleted!",
  });
});
