// Helper function to calculate the total uploaded size for the day
const calculateDailyUsage = (videos) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD'
    let totalUsedBytes = 0;
  
    videos.forEach((video) => {
      const videoDate = new Date(video.createdAt).toISOString().split('T')[0];
      if (videoDate === currentDate) {
        totalUsedBytes += parseInt(video.size, 10); // Add video size (bytes)
      }
    });
  
    return totalUsedBytes / (1024 * 1024); // Convert bytes to MB
  };