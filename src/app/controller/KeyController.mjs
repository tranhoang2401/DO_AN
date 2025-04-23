import Keys from '../model/Keys.mjs'
import crypto from 'crypto';

class KeyController {
  async getAllKeysByUserID(req, res) {
    try {
      const keys = await Keys.find({ userID: req.user._id });
      return res.status(200).json({
        success: true,
        message: 'Retrieve Key data successfully!',
        keys,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async generateKey(req, res) {
    try {
      const userID = req.user._id;
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      // Tạo chuỗi ngẫu nhiên 12 ký tự
      let randomString = '';
      for (let i = 0; i < 12; i++) {
        randomString += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }

      // Kết hợp userID và chuỗi ngẫu nhiên, sau đó băm chuỗi này để tạo Key duy nhất
      const uniqueString = userID + randomString;
      const key = crypto
        .createHash('sha256')
        .update(uniqueString)
        .digest('hex')
        .substring(0, 12);

        const newKey = new Keys({
            key,
            userID
        });

        await newKey.save();

      return res.status(200).json({
        success: true,
        key: key,
        message: 'Key generated successfully.',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }
}

export default new KeyController();
