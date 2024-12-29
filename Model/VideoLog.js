const mongoose = require('mongoose');

const VideoLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing whitespace
  },
  videoSize: {
    type: Number,
    required: true,
    min: 0, // Ensures videoSize cannot be negative
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date and time
  },
});

const VideoLog = mongoose.model('VideoLog', VideoLogSchema);

module.exports = VideoLog;
