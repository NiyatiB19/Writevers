
import mongoose from 'mongoose';
import Post from './models/Post.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/writeverse";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB via check_authors.js");
        try {
            const missingAuthorPosts = await Post.countDocuments({
                $or: [{ authorId: { $exists: false } }, { authorId: null }]
            });
            console.log(`Posts with missing authorId: ${missingAuthorPosts}`);

            const allPosts = await Post.countDocuments({});
            console.log(`Total posts: ${allPosts}`);

        } catch (err) {
            console.error(err);
        } finally {
            await mongoose.disconnect();
            process.exit(0);
        }
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
