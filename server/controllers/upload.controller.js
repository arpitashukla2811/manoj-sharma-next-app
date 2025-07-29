import fs from 'fs';
import path from 'path';
import { uploadSingle, uploadMultiple, uploadFields, handleMulterError } from '../config/multer.js';

// Upload single image
export const uploadSingleImage = async (req, res) => {
  try {
    uploadSingle(req, res, async (err) => {
      if (err) {
        return handleMulterError(err, req, res, () => {});
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded.'
        });
      }

      // Create file URL
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      res.status(200).json({
        success: true,
        message: 'File uploaded successfully.',
        data: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: fileUrl,
          path: req.file.path
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed.',
      error: error.message
    });
  }
};

// Upload multiple images
export const uploadMultipleImages = async (req, res) => {
  try {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        return handleMulterError(err, req, res, () => {});
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded.'
        });
      }

      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        path: file.path
      }));

      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} files uploaded successfully.`,
        data: uploadedFiles
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed.',
      error: error.message
    });
  }
};

// Upload specific fields (cover + gallery)
export const uploadBookImages = async (req, res) => {
  try {
    uploadFields(req, res, async (err) => {
      if (err) {
        return handleMulterError(err, req, res, () => {});
      }

      const uploadedFiles = {};

      if (req.files.coverImage) {
        uploadedFiles.coverImage = {
          filename: req.files.coverImage[0].filename,
          originalname: req.files.coverImage[0].originalname,
          mimetype: req.files.coverImage[0].mimetype,
          size: req.files.coverImage[0].size,
          url: `${req.protocol}://${req.get('host')}/uploads/${req.files.coverImage[0].filename}`,
          path: req.files.coverImage[0].path
        };
      }

      if (req.files.galleryImages) {
        uploadedFiles.galleryImages = req.files.galleryImages.map(file => ({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
          path: file.path
        }));
      }

      res.status(200).json({
        success: true,
        message: 'Files uploaded successfully.',
        data: uploadedFiles
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed.',
      error: error.message
    });
  }
};

// Delete uploaded file
export const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required.'
      });
    }

    // Check if file exists
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found.'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete file.',
      error: error.message
    });
  }
};

// Get file info
export const getFileInfo = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required.'
      });
    }

    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found.'
      });
    }

    const stats = fs.statSync(filePath);
    const fileInfo = {
      filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      url: `${req.protocol}://${req.get('host')}/uploads/${filename}`
    };

    res.status(200).json({
      success: true,
      data: fileInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get file info.',
      error: error.message
    });
  }
};

// List uploaded files
export const listFiles = async (req, res) => {
  try {
    const { directory = 'uploads' } = req.query;
    const dirPath = path.join(process.cwd(), directory);
    
    if (!fs.existsSync(dirPath)) {
      return res.status(404).json({
        success: false,
        message: 'Directory not found.'
      });
    }

    const files = fs.readdirSync(dirPath);
    const fileList = files.map(filename => {
      const filePath = path.join(dirPath, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `${req.protocol}://${req.get('host')}/${directory}/${filename}`,
        isDirectory: stats.isDirectory()
      };
    });

    res.status(200).json({
      success: true,
      data: fileList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to list files.',
      error: error.message
    });
  }
};

// Clean up temporary files
export const cleanupTempFiles = async (req, res) => {
  try {
    const tempDir = path.join(process.cwd(), 'uploads', 'temp');
    
    if (!fs.existsSync(tempDir)) {
      return res.status(404).json({
        success: false,
        message: 'Temp directory not found.'
      });
    }

    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    let deletedCount = 0;

    files.forEach(filename => {
      const filePath = path.join(tempDir, filename);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    res.status(200).json({
      success: true,
      message: `${deletedCount} temporary files cleaned up.`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup temporary files.',
      error: error.message
    });
  }
}; 