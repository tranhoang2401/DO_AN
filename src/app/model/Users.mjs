import dotenv from 'dotenv';
dotenv.config();
import { Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Users = new Schema(
  {
    fullName: {
      type: String,
      default: '',
      maxLength: 200,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: null,
      maxLength: 10,
      trim: true,
    },
    password: {
      type: String,
      default: '$2a$10$ZD/EROx56XOvcutCg9jHxeXrz.iqMstXUCksTyvBb8gfD8SPPm7uW',
      required: true,
      trim: true,
      minLength: 7,
    },
  },
  {
    timestamps: true,
  }
);

Users.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(user.password, 10);
  }
  next();
});


Users.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id, roleID: this.roleID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '60m',
  });
};

Users.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id, roleID: this.roleID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '365d',
  });
};

export default model('users', Users);
