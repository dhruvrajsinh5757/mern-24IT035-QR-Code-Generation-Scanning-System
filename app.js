import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.js';
import qrRoutes from './routes/qr.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit the process, just log the error
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);

// Start server with port conflict handling
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  const MAX_PORT = 5010;
  let currentPort = PORT;

  const server = app.listen(currentPort, () => {
    console.log(`Server running on port ${currentPort}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${currentPort} is in use, trying port ${currentPort + 1}`);
      currentPort++;
      
      if (currentPort > MAX_PORT) {
        console.error('Could not find an available port between 5000 and 50010');
        process.exit(1);
      }
      
      server.close();
      server.listen(currentPort);
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });
};

startServer(); 