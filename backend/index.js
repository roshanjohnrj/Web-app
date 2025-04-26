import express from 'express';
import cors from 'cors'; // For enabling CORS


const app = express();
const port = 5000; // You can choose a different port
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cors()); // Enable CORS for all origins (for development)

app.post('/upload-media', (req, res) => {
    const { type, source, data, uri } = req.body;
  
    if (type === 'image' && source === 'camera' && data) {
      // Process the image data (save to file, database, etc.)
      console.log('Received image from camera (first 50 chars):', data.substring(0, 50) + '...');
      res.json({ message: 'Image from camera uploaded successfully!' });
    } else if (type === 'file' && source === 'storage' && uri) {
      // Handle the file URI (for learning, just log it)
      console.log('Received file URI from storage:', uri);
      res.json({ message: 'File URI from storage received!' });
    } else {
      res.status(400).json({ error: 'Invalid upload request.' });
    }
  });

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});