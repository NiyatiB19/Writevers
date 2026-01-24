import Post from "../models/Post.js";
import User from "../models/User.js";
import { categories, trending, writers } from "../data/dummyData.js";

// --- Data Routes ---

export const getHomeData = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({
      categories,
      posts,
      trending,
      writers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    // Check if ID is a valid ObjectId, otherwise it might be a legacy ID which we can't handle easily or we assume all are ObjectIds now
    // For smoother transition, we just try to find by ID.
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, subtitle, content, image, authorName, authorEmail, authorAvatar, category } = req.body;

  try {
    const newPost = await Post.create({
      title,
      excerpt: subtitle || content.substring(0, 100) + "...",
      content,
      image: image || "https://images.unsplash.com/photo-1499750310159-5b5f87ae97e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: authorName || "You",
      authorEmail,
      authorAvatar: authorAvatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      category: category || "Personal",
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (post) {
      res.json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, subtitle, content, image, category } = req.body;
    const post = await Post.findById(req.params.id);

    if (post) {
      post.title = title || post.title;
      post.excerpt = subtitle || post.excerpt;
      post.content = content || post.content;
      post.image = image || post.image;
      post.category = category || post.category;

      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Social Routes ---

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.likes += 1;
      await post.save();
      res.json({ likes: post.likes });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  const { user, text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      const newComment = {
        user,
        text,
        date: new Date()
      };
      post.commentsData.push(newComment);
      post.comments = post.commentsData.length;
      await post.save();
      res.status(201).json(newComment);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Auth Routes ---

export const signup = async (req, res) => {
  const { name, email, password, phone, address, interests, hobbies } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // Note: In a real app, hash this password!
      phone,
      address,
      interests,
      hobbies
    });

    if (user) {
      res.status(201).json({
        message: "User created successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        }
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && user.password === password) { // Note: Implement hash comparison
      res.json({
        message: "Login success",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          phone: user.phone,
          address: user.address,
          interests: user.interests,
          hobbies: user.hobbies
        },
        token: `mock-token-${user._id}`
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // Assuming the ID passed is the MongoDB _id
    const user = await User.findById(req.query.id);
    if (user) {
      const { password, ...userInfo } = user._doc;
      res.json(userInfo);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // If ID is invalid format
    res.status(404).json({ message: "User not found" });
  }
};

export const updateUserProfile = async (req, res) => {
  const { id, ...updates } = req.body;
  try {
    const user = await User.findById(id);

    if (user) {
      Object.assign(user, updates);
      const updatedUser = await user.save();
      const { password, ...userInfo } = updatedUser._doc;
      res.json({ message: "Profile updated", user: userInfo });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
