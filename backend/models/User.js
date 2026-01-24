import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    interests: { type: String },
    hobbies: { type: String },
    avatar: { type: String, default: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
