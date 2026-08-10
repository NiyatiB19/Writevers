import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    interests: { type: String },
    hobbies: { type: String },
    avatar: { type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" },
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
