import mongoose from 'mongoose';

const replySchema = mongoose.Schema({
    user: {
        name: String,
        avatar: String
    },
    text: String,
    date: { type: Date, default: Date.now }
});

const commentSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Ensure ID for replies
    user: {
        name: String,
        avatar: String
    },
    text: String,
    date: { type: Date, default: Date.now },
    replies: [replySchema]
});

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    image: { type: String },
    category: { type: String, default: "Personal" },
    tags: [{ type: String }],
    author: { type: String, required: true },
    authorEmail: { type: String },
    authorAvatar: { type: String },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User IDs
    comments: { type: Number, default: 0 },
    commentsData: [commentSchema],
    readTime: { type: String, default: "5 min read" },
    status: { type: String, enum: ['pending', 'onhold', 'published', 'rejected'], default: 'published' },
    rejectionReason: { type: String },
    rejectedAt: { type: Date },
    reports: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        date: { type: Date, default: Date.now }
    }],
    isReported: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;
