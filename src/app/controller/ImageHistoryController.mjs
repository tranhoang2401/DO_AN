import dotenv from 'dotenv';
import ImageHistorys from '../model/ImageHistories.mjs';

dotenv.config();

class ImageHistoryController {
  async getAllImageHistoryByUser(req, res) {
    try {
      const images = await ImageHistorys.find({userID: req.user._id});
      return res
        .status(200)
        .json({ success: true, message: 'GET successful!', images });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getSingleImageHistory(req, res) {
    try {
      const image = await ImageHistorys.findById(req.params._id);
      if (!image) {
        return res
          .status(404)
          .json({ success: false, message: 'image not found' });
      }
      return res
        .status(200)
        .json({ success: true, message: 'image found', image });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }
}

export default new ImageHistoryController();
