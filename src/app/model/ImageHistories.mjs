import dotenv from 'dotenv';
dotenv.config();
import { Schema, model } from 'mongoose';
import cloudinary from '../../config/cloudinary/index.mjs';

const ImageHistory = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'users',
    },
    imageUrl: {
      type: String,
      default: null,
      maxLength: 200,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ImageHistory.statics.uploadFileToCloudinary = async function (file) {
  try {
    if (!file) {
      console.error("File missing");
      return { status: false, message: "Missing information" };
    }

    const base64Image = file.startsWith('data:image/')
    ? file
    : `data:image/jpeg;base64,${file}`;

    console.log("Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(base64Image, {
      upload_preset: process.env.UPLOAD_PRESET,
      folder: 'smart_door',
    });

    console.log("Upload result:", result);
    return { status: true, message: "Upload successful", imageUrl: result.secure_url };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { status: false, message: "Error uploading image",  error: error.message, };
  }
};


export default model('image_histories', ImageHistory);
