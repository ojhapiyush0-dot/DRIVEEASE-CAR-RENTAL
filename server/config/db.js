import mongoose from 'mongoose';

export async function connectDb(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri);
    console.log('MongoDB Atlas connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}
