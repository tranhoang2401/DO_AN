import dotenv from 'dotenv';
import Users from '../model/Users.mjs';
import bcryptjs from 'bcryptjs';

dotenv.config();

class UserController {
  async getAllUser(req, res) {
    try {
      const users = await Users.find({}).select('-password');
      return res
        .status(200)
        .json({ success: true, message: 'GET successful!', users });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getSingleUser(req, res) {
    try {
      const user = await Users.findById(req.params._id).select('-password');
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'user not found' });
      }
      return res
        .status(200)
        .json({ success: true, message: 'user found', user });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async deleteUserById(req, res) {
    try {
      const user = await Users.findByIdAndDelete(req.params._id);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'User not found in system' });
      } else {
        return res
          .status(200)
          .json({ success: true, message: 'Delete user successful!' });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
    }

  async updateInfo(req, res) {
    try {
      const { fullName, phoneNumber } = req.body;
      const user = await Users.findById(req.params._id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
      } else {
        user.fullName = fullName;
        user.phoneNumber = phoneNumber;
        await user.save();
        return res
          .status(200)
          .json({ success: true, message: 'Update user successfull', user });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async updatePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
  
      if (!newPassword || !oldPassword) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid new password or old password!' });
      }
  
      // Tìm người dùng trong cơ sở dữ liệu
      const user = await Users.findById(req.user._id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'user not found!' });
      }
  
      // So sánh mật khẩu cũ với mật khẩu trong DB
      const isMatch = await bcryptjs.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: 'Old password is incorrect!' });
      }
  
      // Mã hóa mật khẩu mới
      const hashPassword = await bcryptjs.hash(newPassword, 10);
  
      // Cập nhật mật khẩu mới vào cơ sở dữ liệu
      await Users.findByIdAndUpdate(req.user._id, { password: hashPassword });
  
      return res
        .status(200)
        .json({ success: true, message: 'Update password success!' });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }  
}

export default new UserController();
