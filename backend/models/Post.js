import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    user: {
        name: String,
        avatar: String
    },
    text: String,
    date: { type: Date, default: Date.now }
});

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    image: { type: String },
    category: { type: String, default: "Personal" },
    author: { type: String, required: true },
    authorEmail: { type: String },
    authorAvatar: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    commentsData: [commentSchema],
    readTime: { type: String, default: "5 min read" },
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;
