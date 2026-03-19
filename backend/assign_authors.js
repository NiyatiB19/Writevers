
import mongoose from 'mongoose';
import Post from './models/Post.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/writeverse";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB via assign_authors.js");
        try {
            const user = await User.findOne();
            if (!user) {
                console.log("No users found! Cannot assign posts.");
                process.exit(1);
            }

            console.log(`Assigning orphan posts to user: ${user.name} (${user._id})`);

            const result = await Post.updateMany(
                { $or: [{ authorId: { $exists: false } }, { authorId: null }] },
                {
                    $set: {
                        authorId: user._id,
                        author: user.name,
                        authorEmail: user.email,
                        authorAvatar: user.avatar || "https://i.pravatar.cc/150"
                    }
                }
            );

            console.log(`Updated ${result.modifiedCount} orphan posts.`);

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
