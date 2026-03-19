import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const categories = ["Technology", "Lifestyle", "Travel", "Food", "Business", "Health", "Fashion"];

const seedData = async () => {
    try {
        await Post.deleteMany({}); // Clear existing posts
        console.log("Cleared existing posts.");

        const posts = [];

        categories.forEach(category => {
            for (let i = 1; i <= 4; i++) {
                posts.push({
                    title: `${category} Article ${i}: The Future of ${category}`,
                    excerpt: `This is a short summary for ${category} article number ${i}. It covers key trends and insights.`,
                    content: `Here is the full content for the ${category} article ${i}. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
                    image: `https://loremflickr.com/800/600/${category}?lock=${i}`,
                    category: category,
                    author: "WriteVerse Editor",
                    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
                    readTime: `${Math.floor(Math.random() * 10) + 3} min read`,
                    views: Math.floor(Math.random() * 5000) + 500,
                    likes: Math.floor(Math.random() * 500),
                    comments: 0,
                    status: 'published'
                });
            }
        });

        await Post.insertMany(posts);
        console.log(`Successfully seeded ${posts.length} posts!`);
        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
