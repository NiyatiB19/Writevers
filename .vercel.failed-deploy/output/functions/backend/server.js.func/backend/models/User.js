import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    interests: { type: String },
    hobbies: { type: String },
    avatar: { type: String, default: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    isAdmin: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
