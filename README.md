This is the third basic project assigned to me as an intern at SlashMark IT Startup
# Image Encryption and Decryption Web Application

This project is a web application that allows users to encrypt images, download the encrypted files, and then decrypt and view them. It uses a MERN stack (MongoDB, Express.js, React.js, Node.js) and implements AES-256-CBC encryption.

## Features

- Upload and encrypt images
- Download encrypted images
- Upload encrypted images with their corresponding key files
- Decrypt and view images in the browser

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm
- You have installed MongoDB and it's running on your local machine
- You have a basic understanding of JavaScript and React

## Installing and Running the Application

To install and run this application, follow these steps:

1. Clone the repository
   ```
   git clone https://github.com/czr-snail/Image-Encryption.git
   cd image-encryption-app
   ```

2. Install the dependencies for both the server and client
   ```
   cd server
   npm install
   cd ../client
   npm install
   ```

3. Create a `.env` file in the client directory and add the following:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the server
   ```
   cd ../server
   node server.js
   ```

5. In a new terminal, start the client
   ```
   cd ../client
   npm start
   ```

6. Open your web browser and navigate to `http://localhost:3000`

## Using the Application

1. To encrypt an image:
   - Click on the file input under "Encrypt Image"
   - Select an image file (.jpg, .jpeg, or .png)
   - Click the "Encrypt" button
   - Once encryption is complete, click "Download Encrypted File" to save the encrypted image

2. To decrypt an image:
   - Click on the first file input under "Decrypt Image"
   - Select the encrypted image file you just downloaded
   - Click on the second file input
   - Select the corresponding key file (it will have the same name as the original image file, but with a .key extension)
   - Click the "Decrypt" button
   - The decrypted image will be displayed in the browser
![Screenshot 2024-06-24 194031](https://github.com/czr-snail/Image-Encryption/assets/162822108/d90cdeb4-ac4b-407f-a2cc-d9bfaaca7f5d)

![Screenshot 2024-06-24 194048](https://github.com/czr-snail/Image-Encryption/assets/162822108/9acbc862-f7de-47fd-bb5c-4fe04f8c36d9)

![Screenshot 2024-06-24 194102](https://github.com/czr-snail/Image-Encryption/assets/162822108/2a4f3cef-2620-46b7-8112-fe5c4f7bc693)
![Screenshot 2024-06-24 194118](https://github.com/czr-snail/Image-Encryption/assets/162822108/2f7eca03-4f4d-4b65-9ce7-d3a746e6bd38)![Screenshot 2024-06-24 194229](https://github.com/czr-snail/Image-Encryption/assets/162822108/0427f2af-515a-4f76-92c5-9ec1b6f5e60e)
![Screenshot 2024-06-24 194242](https://github.com/czr-snail/Image-Encryption/assets/162822108/962158b6-17de-4bb8-94a2-1266dc49210b)
![Screenshot 2024-06-24 194256](https://github.com/czr-snail/Image-Encryption/assets/162822108/d4963cd1-ae67-44ad-aa20-8db2cf68bde5)

