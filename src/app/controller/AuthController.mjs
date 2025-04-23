import dotenv from 'dotenv';
import Users from '../model/Users.mjs';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';
import Histories from '../model/Histories.mjs';
//---------------------------------------

dotenv.config();

class AuthController {
  async getUserProfile(req, res) {
    try {
      const user = await Users.findById(req.user._id).select('-password');
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found!' });
      }
      return res.status(200).json({
        success: true,
        message: 'User found!',
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }
  
  async login(req, res) {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phoneNumber and password.',
      });
    }

    try {
      const user = await Users.findOne({ phoneNumber });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phoneNumber or password!',
        });
      }

      const passwordMatch = await bcryptjs.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phoneNumber or password!',
        });
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      return res.status(201).json({
        success: true,
        message: 'Logged in successfully!',
        accessToken,
        refreshToken,
        expiresIn: 3600
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async register(req, res) {
    try {
      const { fullName, phoneNumber, password  } =
        req.body;

      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      // Check if phoneNumber or email already exists
      const existingUser = await Users.findOne({
        $or: [{ phoneNumber }],
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone Number already exists!',
        });
      }

      const newUser = new Users({
        fullName,
        phoneNumber,
        password
      });

      await newUser.save();

      const history = new Histories({
        userID: newUser._id
      });

      await history.save();

      return res.status(200).json({
        success: true,
        message: 'Register successful!'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'RefreshToken not found.',
        });
      }

      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        if (!decoded) {
          return res.status(403).json({
            success: false,
            message: 'RefreshToken is invalid.',
          });
        } else {
          const user = await Users.findById(decoded._id);
          const accessToken = user.generateAccessToken();

          return res.status(200).json({
            success: true,
            message: 'New AccessToken generated!',
            accessToken,
          });
        }
      } catch (verifyError) {
        return res.status(403).json({
          success: false,
          message: 'RefreshToken is invalid.',
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }
}

export default new AuthController();
