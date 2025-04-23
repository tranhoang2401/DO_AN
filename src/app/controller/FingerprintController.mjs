import dotenv from 'dotenv';
import Fingerprints from '../model/Fingerprints.mjs';

dotenv.config();

class FingerprintController {

  async getAllByUserId(req, res) {
    try {
      const fingerprints = await Fingerprints.find({ userID: req.user._id });
      if (!fingerprints || fingerprints.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'No fingerprints found for this user!' });
      }
    
      return res.status(200).json({
        success: true,
        message: 'Retrieve fingerprints successful!',
        fingerprints,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  // Lấy dấu vân tay theo ID
  async getById(req, res) {
    try {
      const fingerprint = await Fingerprints.findById(req.params.id);
      if (!fingerprint) {
        return res
          .status(404)
          .json({ success: false, message: 'Fingerprint not found!' });
      }
      return res
        .status(200)
        .json({ success: true, message: 'Fingerprint found!', fingerprint });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  // Sửa dấu vân tay theo ID
  async updateFingerprint(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: 'Name data is required!' });
      }

      const updatedFingerprint = await Fingerprints.findByIdAndUpdate(
        req.params._id,
        { name },
        { new: true } // Trả về đối tượng mới sau khi cập nhật
      );

      if (!updatedFingerprint) {
        return res
          .status(404)
          .json({ success: false, message: 'Fingerprint update failed!' });
      }

      return res
        .status(200)
        .json({ success: true, message: 'Fingerprint updated successfully!', fingerprint: updatedFingerprint });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  // Xoá dấu vân tay theo ID
  async deleteFingerprint(req, res) {
    try {
      const deletedFingerprint = await Fingerprints.findByIdAndDelete(req.params._id);
      if (!deletedFingerprint) {
        return res
          .status(400)
          .json({ success: false, message: 'Fingerprint delete failed!' });
      }

      return res
        .status(200)
        .json({ success: true, message: 'Fingerprint deleted successfully!' });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }
}

export default new FingerprintController();
