
const mongoose = require('mongoose');

const profileBackupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profileData: {
    type: Object,
    required: true
  },
  backupDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProfileBackup', profileBackupSchema);