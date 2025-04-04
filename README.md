# MERN Stack QR Code Generation & Scanning System

A full-stack application for generating and scanning QR codes, built with the MERN stack.

## Features

- User authentication (Signup/Login)
- QR code generation from text/URL
- QR code scanning using device camera
- QR code history with pagination
- Filter QR codes by date range
- Download QR codes as images
- Copy QR code URL to clipboard
- Share QR codes via email

## Tech Stack

- Frontend: React (Vite) + Material-UI
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT
- QR Code Generation: qrcode.react
- QR Code Scanning: react-qr-reader
- Email Sharing: Nodemailer

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/qr-code-system
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Register a new account or login with existing credentials
2. Generate QR codes by entering text or URLs
3. Use the scanner to scan QR codes
4. View your QR code history
5. Filter QR codes by date range
6. Download, copy, or share QR codes

## API Endpoints

### Authentication
- POST /api/auth/signup - User registration
- POST /api/auth/login - User login

### QR Codes
- POST /api/qrcodes - Generate a new QR code
- GET /api/qrcodes - Get all QR codes (with pagination & filters)
- DELETE /api/qrcodes/:id - Delete a specific QR code
- POST /api/qrcodes/share - Share QR code via email
- POST /api/qrcodes/scan - Save scanned QR code

## License

MIT 