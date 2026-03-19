
import mongoose from 'mongoose';
import Post from './models/Post.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/writeverse";

console.log('Connecting to:', MONGO_URI);

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB");
        try {
            const result = await Post.updateMany(
                { status: 'pending' },
                { $set: { status: 'published' } }
            );
            console.log(`Updated ${result.modifiedCount} posts from pending to published.`);

            // Also verify if there are any posts without status and set them to published
            const result2 = await Post.updateMany(
                { status: { $exists: false } },
                { $set: { status: 'published' } }
            );
            console.log(`Updated ${result2.modifiedCount} posts with missing status to published.`);

        } catch (err) {
            console.error('Error updating posts:', err);
        } finally {
            await mongoose.disconnect();
            console.log('Disconnected');
            process.exit(0);
        }
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
