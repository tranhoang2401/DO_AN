import dotenv from 'dotenv';
dotenv.config();
import { Schema, model } from 'mongoose';

const Keys = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'users',
    },
  },
  {
    timestamps: true,
  }
);

export default model('keys', Keys);
