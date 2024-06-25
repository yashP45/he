import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import pdfRoutes from './routes/pdfRoutes';
import dotenv from 'dotenv'; 
dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', pdfRoutes);

const mongourl = process.env.MONGOURL || '' ;
// MongoDB connection
mongoose.connect(mongourl, {}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err: any) => {
  console.error('Could not connect to MongoDB', err);
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
