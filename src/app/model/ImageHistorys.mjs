import dotenv from 'dotenv';
dotenv.config();
import { Schema, model } from 'mongoose';

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

export default model('image_historys', ImageHistory);
