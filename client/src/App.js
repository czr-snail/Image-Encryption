import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [keyFile, setKeyFile] = useState(null);
  const [result, setResult] = useState(null);
  const [decryptedImage, setDecryptedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e, fileType) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileType === 'image') {
        setFile(selectedFile);
      } else if (fileType === 'encrypted') {
        setEncryptedFile(selectedFile);
      } else if (fileType === 'key') {
        setKeyFile(selectedFile);
      }
      setError(null);
    }
  };

  const handleEncrypt = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to encrypt');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      setError('Error uploading and encrypting file: ' + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async (e) => {
    e.preventDefault();
    if (!encryptedFile || !keyFile) {
      setError('Please select both encrypted file and key file');
      return;
    }

    const formData = new FormData();
    formData.append('encryptedImage', encryptedFile);
    formData.append('key', keyFile);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/decrypt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDecryptedImage(`${process.env.REACT_APP_API_URL}/${response.data.decryptedImage}`);
    } catch (error) {
      console.error('Error decrypting file:', error.response ? error.response.data : error.message);
      setError('Error decrypting file: ' + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result && result.encryptedImage) {
      window.open(`${process.env.REACT_APP_API_URL}/download/${result.encryptedImage}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Encryption and Decryption</h1>
        
        <h2>Encrypt Image</h2>
        <form onSubmit={handleEncrypt}>
          <input type="file" onChange={(e) => handleFileChange(e, 'image')} accept=".jpg,.jpeg,.png" />
          <button type="submit" disabled={loading || !file}>
            {loading ? 'Processing...' : 'Encrypt'}
          </button>
        </form>
        
        {result && (
          <div className="result">
            <h3>Encryption Successful!</h3>
            <p>Encrypted image: {result.encryptedImage}</p>
            <p>Key file: {result.key}</p>
            <button onClick={handleDownload}>Download Encrypted File</button>
          </div>
        )}

        <h2>Decrypt Image</h2>
        <form onSubmit={handleDecrypt}>
          <input type="file" onChange={(e) => handleFileChange(e, 'encrypted')} accept=".png" />
          <input type="file" onChange={(e) => handleFileChange(e, 'key')} accept=".key" />
          <button type="submit" disabled={loading || !encryptedFile || !keyFile}>
            {loading ? 'Processing...' : 'Decrypt'}
          </button>
        </form>

        {decryptedImage && (
          <div className="result">
            <h3>Decryption Successful!</h3>
            <img src={decryptedImage} alt="Decrypted" style={{maxWidth: '100%', maxHeight: '300px'}} />
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </header>
    </div>
  );
}

export default App;