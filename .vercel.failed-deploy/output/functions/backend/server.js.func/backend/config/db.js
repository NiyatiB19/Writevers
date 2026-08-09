import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection) return cachedConnection;

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('MONGO_URI is not configured');
    }

    if (process.env.VERCEL && mongoUri.includes('localhost')) {
        throw new Error('MONGO_URI points to localhost. Use a cloud MongoDB URI for Vercel.');
    }

    try {
        mongoose.set('bufferCommands', false);
        cachedConnection = mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000
        });

        const conn = await cachedConnection;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        cachedConnection = null;
        console.error(`Error: ${error.message}`);
        throw error;
    }
};

export default connectDB;
