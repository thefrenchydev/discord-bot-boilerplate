import mongoose from 'mongoose';
import { setServers } from 'node:dns';

setServers(['1.1.1.1', '8.8.8.8']);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected...');
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error', err);
    }
    process.exit(1);
  }
};

export default connectDB;
