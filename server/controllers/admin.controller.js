import Admin from '../models/admin.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Login successful.',
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
        },
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Validate admin token
export const validateAdminToken = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Optionally, add registerAdmin if you want to allow admin registration
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email already exists.' });
    }
    const admin = await Admin.create({ name, email, password });
    if (admin) {
      res.status(201).json({
        message: 'Admin registered successfully.',
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
        },
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password');
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 