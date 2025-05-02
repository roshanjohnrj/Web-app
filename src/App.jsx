import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios

function App() {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [fileBase64Data, setFileBase64Data] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const handleReactNativeMessage = (event) => {
      console.log('Received message in WebView:', event.data)
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'image' || data.type === 'file') {
          setUploadStatus(''); // Reset status first
          if (data.source === 'camera' && data.data) {
            setImagePreviewUrl(data.data);
            setFileBase64Data(null);
          } else if (data.source === 'storage' && data.data) {
            setFileBase64Data(data.data);
            setImagePreviewUrl(null);
            setUploadStatus('File selected.'); //  Simplified status
          } else {
            setImagePreviewUrl(null);
            setFileBase64Data(null);
          }
        }
      } catch (error) {
        console.error('Error processing message from React Native:', error);
        setImagePreviewUrl(null);
        setFileBase64Data(null);
        setUploadStatus('Error processing data.');
      }
    };
  
    window.addEventListener('message', handleReactNativeMessage);
  
    return () => {
      window.removeEventListener('message', handleReactNativeMessage);
    };
  },  [setImagePreviewUrl, setFileBase64Data, setUploadStatus]);


  const handleOpenCamera = () => {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'uploadRequest', source: 'camera' }));
      setUploadStatus('Opening camera...');
    } else {
      alert('Camera functionality not available in this context.');
    }
  };

  const handleChooseFile = () => {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'uploadRequest', source: 'storage' }));
      setUploadStatus('Opening file picker...');
    } else {
      alert('Storage functionality not available in this context.');
    }
  };

  const handleUpload = async () => {
    if (imagePreviewUrl) {
      setUploadStatus('Uploading image to server...');
      try {
        const response = await axios.post('https://web-app-backend-794f.onrender.com/upload-media', {
          type: 'image',
          source: 'camera',
          data: imagePreviewUrl,
        });

        setUploadStatus(response.data.message);
        console.log('Server response:', response.data);
        setUploadSuccess(true); // Set upload success state
        setTimeout(() => {
          setUploadSuccess(false); // Reset after a delay
        }, 3000); // Show success message for 3 seconds
      } catch (error) {
        setUploadStatus(`Upload failed: ${error.message || 'Network error'}`);
        console.error('Upload error:', error);
        setUploadSuccess(false);
      }
    } else if (fileBase64Data) {
      setUploadStatus('Uploading file to server...');
      setUploadStatus('Uploading file to server...');
      try {
        const response = await axios.post('https://web-app-backend-794f.onrender.com/upload-media', {
          type: 'file',
          source: 'storage',
          data: fileBase64Data, // Sending Base64 data
        });
        setUploadStatus(response.data.message);
        console.log('Server response:', response.data);
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      } catch (error) {
        setUploadStatus(`Upload failed: ${error.message || 'Network error'}`);
        console.error('Upload error:', error);
        setUploadSuccess(false);
      }
      // alert('For file URIs, you would typically need to handle the file content differently (e.g., read it in React Native and send it to the backend). This is a more advanced topic.');
    } else {
      setUploadStatus('No image or file selected for upload.');
      setUploadSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 p-6 sm:p-8 md:p-10 lg:p-12 pt-32">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-300">Upload Media</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6 w-full sm:w-auto">
        <button
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline"
          onClick={handleOpenCamera}
        >
          Open Camera
        </button>
        <button
          className="w-full sm:w-auto bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline"
          onClick={handleChooseFile}
        >
          Choose from Storage
        </button>
      </div>

      <div className="mt-4 sm:mt-6 w-full max-w-md relative">
        {imagePreviewUrl && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Image Preview</h2>
            <img src={imagePreviewUrl} alt="Image Preview" className="w-full rounded-md shadow-md" />
          </div>
        )}

        {fileBase64Data && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Selected File</h2>
            <div className="bg-gray-200 p-4 rounded-md shadow-sm">
              <p className="text-gray-600 break-words">{fileBase64Data}</p>
            </div>
          </div>
        )}

        <button
          className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline"
          onClick={handleUpload}
          disabled={!imagePreviewUrl && !fileBase64Data}
        >
          Upload
        </button>

        {uploadStatus && (
          <p className="mt-4 text-center text-sm text-gray-600">{uploadStatus}</p>
        )}

        {uploadSuccess && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-md">
            <div className="bg-white p-6 rounded-md shadow-lg">
              <h2 className="text-xl font-bold text-green-500 mb-2">Upload Successful!</h2>
              <p className="text-gray-700">Your media has been uploaded successfully.</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-200 p-4 rounded-lg shadow-md mt-8 w-full max-w-md">
        <h3 className="font-medium flex items-center text-lg">
          Security Features
        </h3>
        <ul className="mt-2 text-sm text-gray-800">
          <li className="flex items-center py-1">
            • Screen capture protection enabled
          </li>
          <li className="flex items-center py-1">
            • Secure camera access
          </li>
          <li className="flex items-center py-1">
            • Private file handling
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;