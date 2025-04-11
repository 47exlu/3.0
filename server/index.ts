import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Serve static files
app.use(express.static(rootDir));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Game server running on port ${PORT}`);
});