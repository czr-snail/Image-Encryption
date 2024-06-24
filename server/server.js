const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.static('encrypted'));
app.use(express.static('decrypted'));

mongoose.connect('mongodb://localhost/image_encryption', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, file.fieldname === 'key' ? 'keys/' : 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

function encryptImage(imagePath, outputPath, keyPath) {
  const image = fs.readFileSync(imagePath);
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encryptedImage = Buffer.concat([iv, cipher.update(image), cipher.final()]);

  fs.writeFileSync(outputPath, encryptedImage);
  fs.writeFileSync(keyPath, JSON.stringify({ key: key.toString('hex'), iv: iv.toString('hex') }));

  return { encryptedImage: outputPath, key: keyPath };
}

function decryptImage(encryptedPath, keyPath, outputPath) {
  const encryptedImage = fs.readFileSync(encryptedPath);
  const { key, iv } = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  const decryptedImage = Buffer.concat([decipher.update(encryptedImage.slice(16)), decipher.final()]);

  fs.writeFileSync(outputPath, decryptedImage);
  return outputPath;
}

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded or invalid file type');
  }

  const imagePath = req.file.path;
  const outputFileName = `encrypted_${path.basename(req.file.filename)}`;
  const outputPath = path.join('encrypted', outputFileName);
  const keyPath = path.join('keys', `${req.file.filename}.key`);

  try {
    const result = encryptImage(imagePath, outputPath, keyPath);
    res.json({
      message: 'Image encrypted successfully',
      encryptedImage: outputFileName,
      key: path.basename(keyPath)
    });
  } catch (error) {
    console.error('Error encrypting image:', error);
    res.status(500).send('Error encrypting image: ' + error.message);
  }
});

app.post('/decrypt', upload.fields([{ name: 'encryptedImage', maxCount: 1 }, { name: 'key', maxCount: 1 }]), (req, res) => {
  if (!req.files['encryptedImage'] || !req.files['key']) {
    return res.status(400).send('Both encrypted image and key file are required');
  }

  const encryptedPath = req.files['encryptedImage'][0].path;
  const keyPath = req.files['key'][0].path;
  const outputFileName = `decrypted_${path.basename(req.files['encryptedImage'][0].originalname)}`;
  const outputPath = path.join('decrypted', outputFileName);

  try {
    const decryptedImagePath = decryptImage(encryptedPath, keyPath, outputPath);
    res.json({
      message: 'Image decrypted successfully',
      decryptedImage: outputFileName
    });
  } catch (error) {
    console.error('Error decrypting image:', error);
    res.status(500).send('Error decrypting image: ' + error.message);
  }
});

app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'encrypted', req.params.filename);
  res.download(filePath);
});

app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(400).send(error.message);
});

['uploads', 'encrypted', 'keys', 'decrypted'].forEach(dir => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    console.log(`Created directory: ${dir}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});