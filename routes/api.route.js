const router = require('express').Router();
const moment = require('moment');
const VideoLog = require('../Model/VideoLog');

const MAX_UPLOAD_LIMIT_MB = 100;

router.post('/', async (req, res) => {
  const { userId, videoSize } = req.body;

  if (!userId || isNaN(videoSize)) {
    return res.status(400).json({ error: 'Invalid userId or videoSize' });
  }

  try {
    // Get the current date to filter today's logs
    const startOfDay = moment().startOf('day').toDate(); // Get the start of today (00:00:00)
    const endOfDay = moment().endOf('day').toDate();   // Get the end of today (23:59:59)

    // Find all video logs for today for the specified user
    const videoLogsToday = await VideoLog.find({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // Calculate the total storage used today by this user
    const usedStorageMB = videoLogsToday.reduce((acc, log) => acc + log.videoSize, 0);

    // Define the maximum upload limit
    const MAX_UPLOAD_LIMIT_MB = 100; // Set your actual daily limit here

    console.log("User : " + userId + " = " + usedStorageMB + videoSize);
    
    // Check if adding this new video size would exceed the upload limit
    if (usedStorageMB + videoSize >= MAX_UPLOAD_LIMIT_MB) {
      return res.status(200).json({
        error: 'Upload limit exceeded',
        message: `You have reached your daily upload limit of ${MAX_UPLOAD_LIMIT_MB} MB.`,
        canUpload: false,
        remainingBandWith: 100 - usedStorageMB
      });
    }

    // Return the response with remaining storage and the ability to upload
    return res.status(200).json({
      message: 'You are allowed to upload videos',
      remainingStorage: MAX_UPLOAD_LIMIT_MB - usedStorageMB,
      canUpload: true,
      remainingBandWith: 100 - usedStorageMB
    });
  } catch (err) {
    console.error('Error checking video logs:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Add an upload to the db
router.get('/:userId/:videoSize', async (req, res) => {
  const { userId, videoSize } = req.params;

  try {
    // Validate inputs
    if (!userId || isNaN(videoSize)) {
      return res.status(400).json({ error: 'Invalid userId or videoSize' });
    }

    // Create a new log entry
    const newLog = new VideoLog({
      userId,
      videoSize: parseFloat(videoSize), // Ensure videoSize is a number
    });

    // Save to the database
    await newLog.save();

    console.log(newLog);
    

    res.status(201).json({ message: 'Video log saved successfully', log: newLog });
  } catch (error) {
    console.error('Error saving video log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
