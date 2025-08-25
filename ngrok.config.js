const ngrok = require('ngrok');

async function startNgrok() {
  try {
    const url = await ngrok.connect({
      addr: process.env.PORT || 3000,
      region: 'us', // us, eu, ap, au, sa, jp, in
      onStatusChange: status => console.log('Ngrok status:', status),
      onLogEvent: data => console.log('Ngrok log:', data),
    });
    
    console.log('====================================');
    console.log('Ngrok tunnel established!');
    console.log('Public URL:', url);
    console.log('====================================');
    
    // Save the URL to environment or file for other parts of the app to use
    process.env.NGROK_URL = url;
    
    return url;
  } catch (error) {
    console.error('Error starting ngrok:', error);
    process.exit(1);
  }
}

// Handle cleanup
process.on('SIGINT', async () => {
  console.log('Shutting down ngrok...');
  await ngrok.kill();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down ngrok...');
  await ngrok.kill();
  process.exit(0);
});

module.exports = { startNgrok };