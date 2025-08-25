const { spawn } = require('child_process');
const { startNgrok } = require('../ngrok.config');

async function main() {
  // Start ngrok first
  const ngrokUrl = await startNgrok();
  
  // Then start the Next.js dev server
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NGROK_URL: ngrokUrl,
      NEXT_PUBLIC_NGROK_URL: ngrokUrl
    }
  });

  nextProcess.on('error', (error) => {
    console.error('Failed to start Next.js:', error);
    process.exit(1);
  });

  nextProcess.on('exit', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    process.exit(code);
  });
}

main().catch(console.error);