import dotenv from 'dotenv';
import Histories from '../model/Histories.mjs';

dotenv.config();

class HistoryController {
  async getAllHistoryByUser(req, res) {
    try {
      const histories = await Histories.find({userID: req.user._id});
      return res
        .status(200)
        .json({ success: true, message: 'GET successful!', histories });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getSingleHistory(req, res) {
    try {
      const history = await Histories.findById(req.params._id);
      if (!history) {
        return res
          .status(404)
          .json({ success: false, message: 'history not found' });
      }
      return res
        .status(200)
        .json({ success: true, message: 'history found', history });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }
}

export default new HistoryController();
