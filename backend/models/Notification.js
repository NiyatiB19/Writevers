import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['new_post', 'follow', 'report', 'comment', 'like', 'post_rejected', 'admin_message'], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Optional, for post-related notifications
    message: { type: String },
    read: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
