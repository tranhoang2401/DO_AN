import dotenv from 'dotenv';
dotenv.config();
import { Schema, model } from 'mongoose';

const Fingerprint = new Schema(
  {
    userID: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'users',
      },
      name: {
        type: String,
        default: '',
        trim: true
      },
      fingerID: {
        type: String,
        default: null,
        trim: true,
      },
  },
  {
    timestamps: true,
  }
);

export default model('fingerprints', Fingerprint);
