import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Buffer } from 'buffer';

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
  const { type, source, data } = req.body;

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
  } else if (type === 'file' && source === 'storage' && data) { //  && data  <-  IMPORTANT
    try {
      const base64File = data; //  No need to split, data is already the base64
      const fileExtension = getFileExtensionFromBase64(base64File); //  Function
      const fileName = `file_${Date.now()}.${fileExtension}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      const buffer = Buffer.from(base64File, 'base64');
      await fs.writeFile(filePath, buffer);

      console.log('Received and saved file from storage:', filePath);
      res.json({ message: 'File from storage uploaded successfully!', filePath: `/uploads/${fileName}` });
    } catch (error) {
      console.error('Error saving file:', error);
      res.status(500).json({ error: 'Failed to save file.' });
    }
  } else {
    res.status(400).json({ error: 'Invalid upload request.' });
  }
});


// Helper function to extract file extension (Important!)
function getFileExtensionFromBase64(base64Data) {
  const mimeType = base64Data.substring(base64Data.indexOf(":") + 1, base64Data.indexOf(";"));
  const extension = mimeType.split("/")[1];
  return extension;
}

// Serve the uploaded files statically
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});