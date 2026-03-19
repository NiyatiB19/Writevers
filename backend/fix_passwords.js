
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/writeverse";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB via fix_passwords.js");
        try {
            const users = await User.find({});
            console.log(`Found ${users.length} users.`);

            for (const user of users) {
                // Simple check: if password doesn't start with $2, it's likely not a bcrypt hash
                if (!user.password.startsWith('$2')) {
                    console.log(`Fixing password for user: ${user.email}`);
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(user.password, salt); // Assuming stored password is the plain text one they want
                    // If the stored password was ALREADY hashed but just corrupted, this might break it, but usually standard is plain text in seed
                    // However, for safety, let's just reset everyone to a known default if it looks wrong?
                    // Actually, best bet: if it looks like plain text, hash it.

                    user.password = hashedPassword;
                    await user.save();
                    console.log(`Password hashed for ${user.email}`);
                } else {
                    console.log(`User ${user.email} seems to have a valid hash.`);
                }
            }

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
