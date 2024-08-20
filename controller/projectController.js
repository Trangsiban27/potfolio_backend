import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import { Project } from "../models/projectSchema.js";

export const addProject = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Banner is required", 400));
  }

  const { banner } = req.files;

  const cloudinaryResponseBanner = await cloudinary.uploader.upload(
    banner.tempFilePath,
    { folder: "BANNER_PROJECT" }
  );

  if (!cloudinaryResponseBanner || cloudinaryResponseBanner.error) {
    console.error(
      "Cloudinary banner: ",
      cloudinaryResponseBanner.error || "Unknow cloudinary error"
    );
  }

  const { title, description, content, githubLink, technologies } = req.body;

  if (!title || !description || !content || !githubLink || !technologies) {
    return next(new ErrorHandler("Please fill full fields", 400));
  }

  const project = await Project.create({
    title,
    description,
    content,
    githubLink,
    technologies,
    banner: {
      public_id: cloudinaryResponseBanner.public_id,
      url: cloudinaryResponseBanner.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Created Project Successfully!",
    project,
  });
});

export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    githubLink: req.body.githubLink,
    technologies: req.body.technologies,
  };

  if (req.files || req.files.banner) {
    const banner = req.files.banner;

    const project = await Project.findById(req.params.id);
    const bannerId = project.banner.public_id;
    await cloudinary.uploader.destroy(bannerId);

    const cloudinaryResponse = await cloudinary.uploader.upload(
      banner.tempFilePath,
      { folder: "BANNER_PROJECT" }
    );

    newData.banner = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const project = await Project.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Project Updated!",
    project,
  });
});

export const getAllProject = catchAsyncErrors(async (req, res, next) => {
  const project = await Project.find();

  res.status(200).json({ success: true, project });
});

export const getProject = catchAsyncErrors(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  res.status(200).json({ success: true, project });
});

export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project Deleted!",
  });
});
