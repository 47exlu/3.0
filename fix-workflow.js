// Script to update workflow configuration
const fs = require('fs');
const path = require('path');

// Create minimal server/index.ts file to satisfy the workflow
const serverDir = path.join(__dirname, 'server');
if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
}

const indexFilePath = path.join(serverDir, 'index.ts');
const serverContent = `
// This is a minimal server that redirects to our game server
import { exec } from 'child_process';

console.log('Starting game server...');
exec('node game-server.js', (error, stdout, stderr) => {
  if (error) {
    console.error('Error starting game server:', error);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
`;

fs.writeFileSync(indexFilePath, serverContent);
console.log('Created server/index.ts file');

// Create a simple server.js file in the root directory
const gameServerContent = fs.readFileSync(path.join(__dirname, 'game-server.js'), 'utf8');
console.log('Game server file is ready');

console.log('Fix completed. You can now start the game server.');