const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/authenticateToken');
const ProfileBackup = require('../models/profileBackup.js');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createProfileBackup = async (userId, profileData) => {
  try {
    const backup = new ProfileBackup({
      userId,
      profileData,
      backupDate: new Date()
    });
    await backup.save();
    return backup;
  } catch (error) {
    console.error('Backup creation failed:', error);

  }
};

const updateProfile = async (req, res) => {
  try {
    const currentProfile = await User.findById(req.user._id).select('-password');
    if (!currentProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    createProfileBackup(req.user._id, currentProfile.toObject())
      .catch(err => console.error('Background backup failed:', err));

    const updates = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      address: {
        street: req.body.address?.street || currentProfile.address.street,
        city: req.body.address?.city || currentProfile.address.city,
        state: req.body.address?.state || currentProfile.address.state,
        zipCode: req.body.address?.zipCode || currentProfile.address.zipCode,
        country: req.body.address?.country || currentProfile.address.country
      }
    };

    const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
    const missingFields = requiredAddressFields.filter(field => !updates.address[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required address fields: ${missingFields.join(', ')}` 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id, 
      updates,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    createProfileBackup(req.user._id, {
      ...user.toObject(),
      passwordChangeDate: new Date()
    }).catch(err => console.error('Background backup failed:', err));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully'
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({
      message: 'Password reset successfully'
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

router.get('/user-orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('items.productId')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch orders' 
        });
    }
});

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);
router.post('/forgot-password', forgotPassword);

module.exports = router;