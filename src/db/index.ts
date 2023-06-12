import mongoose from 'mongoose';
async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('Mongodb is already connected');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Conneted At ${conn.connection.host}`);
  } catch (error) {
    console.error('mongoose error', error);
  }
}

export default connectDB;
