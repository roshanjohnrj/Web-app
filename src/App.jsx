import React, { useEffect, useState } from 'react';

function App() {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [fileUri, setFileUri] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    const handleReactNativeMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'uploadResult') {
          if (data.source === 'camera' && data.data) {
            setImagePreviewUrl(data.data);
            setFileUri(null);
            setUploadStatus('');
          } else if (data.source === 'storage' && data.uri) {
            setFileUri(data.uri);
            setImagePreviewUrl(null);
            setUploadStatus('File selected. URI: ' + data.uri);
          } else {
            setImagePreviewUrl(null);
            setFileUri(null);
            setUploadStatus('');
          }
        }
      } catch (error) {
        console.error('Error processing message from React Native:', error);
        setImagePreviewUrl(null);
        setFileUri(null);
        setUploadStatus('Error processing data.');
      }
    };

    window.addEventListener('message', handleReactNativeMessage);

    return () => {
      window.removeEventListener('message', handleReactNativeMessage);
    };
  }, []);

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

  const handleUpload = () => {
    if (imagePreviewUrl) {
      setUploadStatus('Uploading image...');
      // In a real scenario, you would send the base64 data to a server here
      console.log('Uploading image:', imagePreviewUrl.substring(0, 100) + '...');
      setTimeout(() => {
        setUploadStatus('Image uploaded successfully!');
      }, 1500);
    } else if (fileUri) {
      setUploadStatus('Uploading file...');
      // In a real scenario, you would handle the file URI (potentially fetching its content or sending the URI to a server)
      console.log('Uploading file URI:', fileUri);
      setTimeout(() => {
        setUploadStatus('File uploaded successfully!');
      }, 1500);
    } else {
      setUploadStatus('No image or file selected for upload.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-300">Upload Media</h1>
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline mr-2"
          onClick={handleOpenCamera}
        >
          Open Camera
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline"
          onClick={handleChooseFile}
        >
          Choose from Storage
        </button>
      </div>

      <div className="mt-6 w-full max-w-md">
        {imagePreviewUrl && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Image Preview</h2>
            <img src={imagePreviewUrl} alt="Image Preview" className="w-full rounded-md shadow-md" />
          </div>
        )}

        {fileUri && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Selected File</h2>
            <div className="bg-gray-200 p-4 rounded-md shadow-sm">
              <p className="text-gray-600">{fileUri}</p>
            </div>
          </div>
        )}

        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline w-full"
          onClick={handleUpload}
          disabled={!imagePreviewUrl && !fileUri}
        >
          Upload
        </button>

        {uploadStatus && (
          <p className="mt-4 text-center text-sm text-gray-600">{uploadStatus}</p>
        )}
      </div>
      <div className="bg-gray-200 p-4 rounded-lg shadow-md mt-10">
          <h3 className="font-medium flex items-center">
            {/* <Shield size={20} className="text-green-500 mr-2" /> */}
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