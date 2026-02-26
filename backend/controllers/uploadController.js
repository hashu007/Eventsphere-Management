const path = require('path');
const fs = require('fs');

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      message: 'Image uploaded successfully',
      filePath: `/uploads/${req.file.filename}`,
      fileName: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete image
// @route   DELETE /api/upload/:filename
// @access  Private
const deleteImage = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage, deleteImage };