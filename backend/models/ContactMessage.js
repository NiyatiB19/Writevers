import mongoose from 'mongoose';

const contactMessageSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    adminReply: { type: String },
    repliedAt: { type: Date },
}, {
    timestamps: true,
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
