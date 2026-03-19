import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import ContactMessage from "../models/ContactMessage.js";
import { categories, trending, writers } from "../data/dummyData.js";
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";



// --- Data Routes ---

export const getHomeData = async (req, res) => {
  try {
    // Only show published posts on public feed (treat missing status as published for backward compat)
    let posts = await Post.find({
      $or: [{ status: 'published' }, { status: { $exists: false } }]
    }).sort({ createdAt: -1 });

    // Personalize if userId is present
    if (req.query.userId) {
      const user = await User.findById(req.query.userId);
      if (user && user.interests) {
        const interestList = user.interests.split(',').map(i => i.trim().toLowerCase());
        posts = posts.filter(p => {
          const hasMatch = interestList.includes(p.category.toLowerCase());
          return hasMatch;
        });
      }
    }

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
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Allow viewing if published, or if requester is author or admin
    const userId = req.query.userId || req.headers['x-user-id'];
    const isPublished = (post.status || 'published') === 'published';
    if (isPublished) {
      return res.json(post);
    }
    if (userId) {
      const user = await User.findById(userId);
      const isAuthor = post.authorId && post.authorId.toString() === userId;
      const isAdmin = user && user.isAdmin;
      if (isAuthor || isAdmin) {
        return res.json(post);
      }
    }
    res.status(404).json({ message: "Post not found" });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "Post not found (Invalid ID)" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, subtitle, content, image, authorName, authorEmail, authorAvatar, authorId, category, tags, collaborators } = req.body;

  try {
    let collaboratorIds = [];
    if (collaborators && Array.isArray(collaborators) && collaborators.length > 0) {
      const emails = collaborators.filter(c => typeof c === 'string' && c.trim() !== '');
      if (emails.length > 0) {
        const users = await User.find({ email: { $in: emails.map(e => e.trim().toLowerCase()) } });
        collaboratorIds = users.map(u => u._id);
      }
    }

    let finalAuthorId = authorId;
    if (!finalAuthorId && authorEmail) {
      const authorUser = await User.findOne({ email: authorEmail });
      if (authorUser) finalAuthorId = authorUser._id;
    }

    const authorUser = await User.findById(finalAuthorId) || await User.findOne({ email: authorEmail });
    const status = (authorUser && authorUser.isAdmin) ? 'published' : 'pending';

    const newPost = await Post.create({
      title,
      excerpt: subtitle || content.substring(0, 100) + "...",
      content,
      image: image || "https://picsum.photos/800/600",
      category: category || "Personal",
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: authorName || "You",
      authorEmail: authorEmail || "unknown@example.com",
      authorAvatar: authorAvatar || "https://i.pravatar.cc/150",
      authorId: finalAuthorId,
      collaborators: collaboratorIds,
      status
    });

    // Notify followers only when published (admin posts)
    if (status === 'published' && authorUser && authorUser.followers && authorUser.followers.length > 0) {
      // Find existing notification to avoid spam
      const existingNotif = await Notification.findOne({ sender: authorUser._id, type: 'new_post', post: newPost._id });
      if (!existingNotif) {
          const notifications = authorUser.followers.map(followerId => ({
            recipient: followerId,
            sender: authorUser._id,
            type: 'new_post',
            post: newPost._id,
            message: `${authorUser.name} published a new post: ${title}`
          }));
          await Notification.insertMany(notifications);
      }
    } else if (status === 'pending') {
         // Notify Admins
         const admins = await User.find({ isAdmin: true });
         const adminNotifications = admins.map(admin => ({
              recipient: admin._id,
              sender: authorUser ? authorUser._id : admin._id, // fallback if anonymous
              type: 'new_post',
              post: newPost._id,
              message: `${authorName || 'A user'} submitted a new post: "${title}" for approval.`
         }));
         await Notification.insertMany(adminNotifications);
    }

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
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (post) {
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      // Check if user already liked
      const index = post.likes.indexOf(userId);
      if (index === -1) {
        // Not liked, so add
        post.likes.push(userId);
        
        // Notify author if it's someone else liking
        if (post.authorId && post.authorId.toString() !== userId) {
            const existingLikeNotif = await Notification.findOne({ sender: userId, recipient: post.authorId, type: 'like', post: post._id });
            if (!existingLikeNotif) {
                const likerUser = await User.findById(userId);
                await Notification.create({
                    recipient: post.authorId,
                    sender: userId,
                    type: 'like',
                    post: post._id,
                    message: `${likerUser ? likerUser.name : 'A user'} liked your post: ${post.title}`
                });
            }
        }
      } else {
        // Already liked, so remove (toggle)
        post.likes.splice(index, 1);
        // Optionally clean up notification if unliked, but skipping for simplicity
      }

      await post.save();
      // Return count and status
      res.json({ likes: post.likes.length, isLiked: index === -1, likeIds: post.likes });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyToComment = async (req, res) => {
  const { user, text } = req.body;
  const { id, commentId } = req.params;

  try {
    const post = await Post.findById(id);
    if (post) {
      const comment = post.commentsData.id(commentId);
      if (comment) {
        const newReply = {
          user,
          text,
          date: new Date()
        };
        comment.replies.push(newReply);
        await post.save();
        res.status(201).json(newReply);
      } else {
        res.status(404).json({ message: "Comment not found" });
      }
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
  let { name, email, password, phone, address, interests, hobbies } = req.body;
  email = email.trim().toLowerCase();

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
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
          avatar: user.avatar,
          interests: user.interests
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
  let { email, password } = req.body;
  email = email.trim().toLowerCase();

  console.log(`[LOGIN ATTEMPT] Email: ${email}`);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("[LOGIN FAILED] User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[LOGIN DEBUG] User found: ${user.email}`);
    console.log(`[LOGIN DEBUG] Stored Hash: ${user.password}`);
    console.log(`[LOGIN DEBUG] Input Password: ${password}`);
    console.log(`[LOGIN DEBUG] Match Result: ${isMatch}`);

    if (isMatch) {
      // Notify user of login
      try {
        await sendEmail(
          email,
          "New Login to WriteVerse",
          `
          <h2>New Login Alert</h2>
          <p>Hello ${user.name},</p>
          <p>We noticed a new login to your WriteVerse account from a device.</p>
          <p>If this was you, you can ignore this email.</p>
          <p>Time: ${new Date().toLocaleString()}</p>
          `
        );
      } catch (emailErr) {
        console.error("Failed to send login email:", emailErr);
      }

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
          hobbies: user.hobbies,
          isAdmin: user.isAdmin,
          following: user.following,
          followers: user.followers
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
      const { password: _, ...userInfo } = updatedUser._doc;
      res.json({ message: "Profile updated", user: userInfo });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- New Social Features ---

export const followUser = async (req, res) => {
  const { currentUserId, targetUserId } = req.body;
  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) return res.status(404).json({ message: "User not found" });

    if (currentUser.following.includes(targetUserId)) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
      await currentUser.save();
      await targetUser.save();
      res.json({ message: "Unfollowed", following: currentUser.following });
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      await currentUser.save();
      await targetUser.save();

      // Notify target user
      const existingFollowNotif = await Notification.findOne({ sender: currentUserId, recipient: targetUserId, type: 'follow' });
      if (!existingFollowNotif) {
          await Notification.create({
            recipient: targetUserId,
            sender: currentUserId,
            type: 'follow',
            message: `${currentUser.name} started following you.`
          });
      }

      res.json({ message: "Followed", following: currentUser.following });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reportPost = async (req, res) => {
  const { userId, reason } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.reports.push({ userId, reason });
    post.isReported = true;
    await post.save();

    // Notify Admins (assuming we have a way to find them, or just store it)
    // For now just success
    res.json({ message: "Post reported successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndDelete(req.params.id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin
export const getReportedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isReported: true }).populate('reports.userId', 'name email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReportedPost = async (req, res) => {
  deletePost(req, res);
};

// --- Pending posts (admin moderation) ---
export const getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('authorId', 'name email avatar');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPostsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate('authorId', 'name email avatar');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approvePost = async (req, res) => {
  try {
    const { status } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: status || 'published', rejectionReason: undefined, rejectedAt: undefined },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    const authorUser = await User.findById(post.authorId);
    if (authorUser && authorUser.followers && authorUser.followers.length > 0) {
      // Avoid sending duplicate publish notification to followers if already sent
      const existingNotif = await Notification.findOne({ sender: authorUser._id, type: 'new_post', post: post._id });
      if (!existingNotif) {
          const notifications = authorUser.followers.map(followerId => ({
            recipient: followerId,
            sender: authorUser._id,
            type: 'new_post',
            post: post._id,
            message: `${authorUser.name} published a new post: ${post.title}`
          }));
          await Notification.insertMany(notifications);
      }
    }
    
    // Notify the author that their post was approved
    if (authorUser && req.adminUser) {
        const approvalNotif = await Notification.findOne({ recipient: authorUser._id, sender: req.adminUser._id, type: 'new_post', post: post._id, message: { $regex: 'approved' }});
        if (!approvalNotif) {
             await Notification.create({
                recipient: authorUser._id,
                sender: req.adminUser._id, // Assume populated by middleware
                type: 'new_post',
                post: post._id,
                message: `Your blog "${post.title}" was approved & published.`
             });
        }
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectPost = async (req, res) => {
  const { reason } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || 'No reason provided.', rejectedAt: new Date() },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.authorId) {
      await Notification.create({
        recipient: post.authorId,
        sender: req.adminUser._id,
        type: 'post_rejected',
        post: post._id,
        message: `Your blog "${post.title}" was rejected. Reason: ${reason || 'No reason provided.'}`
      });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Contact messages ---
export const submitContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const doc = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: "Message sent. We'll get back to you soon.", id: doc._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyToContactMessage = async (req, res) => {
  const { reply } = req.body;
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { adminReply: reply, repliedAt: new Date() },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found" });

    // Simulate sending email
    console.log(`[EMAIL SIMULATION] Replying to ${msg.email} with: ${reply}`);

    // Create notification for the user (if they are a registered user, we'd need to find them by email)
    const user = await User.findOne({ email: msg.email });
    if (user) {
      await Notification.create({
        recipient: user._id,
        sender: req.adminUser._id, // Assumes req.adminUser is set by middleware
        type: 'admin_message',
        message: `Admin replied to your message: "${msg.subject}"`
      });
    }

    res.json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (msg) {
      res.json({ message: "Message deleted successfully" });
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Users (Admin) ---

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- My posts (for profile: all statuses for current user) ---
export const getMyPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const posts = await Post.find({
      $or: [
        { authorId: userId },
        { collaborators: userId }
      ]
    }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(`[FORGOT PASSWORD] Attempt for email: ${email}`);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[FORGOT PASSWORD] User not found for email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log(`[FORGOT PASSWORD] Generated reset link: ${resetLink}`);

    await sendEmail(
      email,
      "WriteVerse Password Recovery",
      `
      <h2>Password Reset</h2>
      <p>You requested to reset your WriteVerse password.</p>
      <a href="${resetLink}" 
         style="padding:10px 20px;background:#6a0dad;color:#fff;text-decoration:none;">
         Reset Password
      </a>
      <p>This link expires in 15 minutes.</p>
      `
    );
    console.log(`[FORGOT PASSWORD] Email sent successfully to: ${email}`);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(`[FORGOT PASSWORD ERROR]`, error);
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword; // hash later for production
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
