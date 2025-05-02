import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config({
  path: '.env',
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure the upload directory exists
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

app.post('/upload-media', async (req, res) => {
  const { type, source, data, uri } = req.body;

  if (type === 'image' && source === 'camera' && data) {
    try {
      const base64Image = data.split(';base64,').pop();
      const imageName = `camera_${Date.now()}.png`;
      const imagePath = path.join(UPLOAD_DIR, imageName);
      const buffer = Buffer.from(base64Image, 'base64');
      await fs.writeFile(imagePath, buffer);

      console.log('Received and saved image from camera:', imagePath);
      res.json({ message: 'Image from camera uploaded successfully!', filePath: `/uploads/${imageName}` });
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Failed to save image.' });
    }
  } else if (type === 'file' && source === 'storage' && uri) {
    console.log('Received file URI from storage (cannot directly access):', uri);
    res.json({ message: 'File URI from storage received! (Backend cannot directly access)' });
  } else {
    res.status(400).json({ error: 'Invalid upload request.' });
  }
});

// Serve the uploaded files statically
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});