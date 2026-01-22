
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables. Please check your .env file.');
}

export default async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('MongoDB connected:', MONGODB_URI!.replace(/:\/\/.*@/, '://[credentials]@'));
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB. Check your MONGODB_URI and MongoDB server.');
  }
}
