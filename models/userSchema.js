import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name Required!"],
  },
  email: {
    type: String,
    required: [true, "Email Requuired!"],
  },
  phone: {
    type: String,
    required: [true, "Phone Requuired!"],
  },
  aboutMe: {
    type: String,
    required: [true, "aboutMe Requuired!"],
  },
  password: {
    type: String,
    required: [true, "Password Requuired!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  potfolioURL: {
    type: String,
    required: [true, "Potfolio URL Is Required!"],
  },
  githubURL: String,
  linkedURL: String,
  facebookURL: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//bcrypts password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 8);
});

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generating json web token
// userSchema.methods.generateJsonWebToken = async function () {
//   if (!process.env.JWT_SECRET_KEY || !process.env.JWT_EXPIRES) {
//     throw new Error(
//       "JWT_SECRET_KEY or JWT_EXPIRES is not defined in environment variables."
//     );
//   }

//   const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRES,
//   });
//   console.log("token = ", token);
//   return token;
// };
userSchema.methods.generateJsonWebToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//get reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  console.log(resetToken);
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
