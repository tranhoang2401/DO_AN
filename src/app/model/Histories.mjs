import dotenv from 'dotenv';
dotenv.config();
import { Schema, model } from 'mongoose';

const Histories = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'users',
    },
    state: {
      type: String,
      default: null,
      maxLength: 10,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


export default model('histories', Histories);
