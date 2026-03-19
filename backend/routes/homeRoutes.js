import {
  getHomeData, getPostById, createPost, signup, login, getUserProfile, updateUserProfile,
  likePost, addComment, replyToComment, deletePost, updatePost, followUser, reportPost,
  getNotifications, markNotificationRead, deleteNotification, getReportedPosts, deleteReportedPost,
  getPendingPosts, approvePost, rejectPost, submitContactMessage, getContactMessages, replyToContactMessage, deleteContactMessage,
  getAllPostsAdmin, getAllUsers,
  getMyPosts, forgotPassword,
  resetPassword
} from "../controllers/homeController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import express from "express";

const router = express.Router();

// Admin Routes (protected by requireAdmin; frontend must send x-user-id header)
// Placed at the top to avoid conflicts
router.get("/admin/reported", requireAdmin, getReportedPosts);
router.delete("/admin/posts/:id", requireAdmin, deleteReportedPost);
router.get("/admin/posts", requireAdmin, getAllPostsAdmin);
router.get("/admin/pending-posts", requireAdmin, getPendingPosts);
router.put("/admin/posts/:id/approve", requireAdmin, approvePost);
router.put("/admin/posts/:id/reject", requireAdmin, rejectPost);
router.get("/admin/contact-messages", requireAdmin, getContactMessages);
router.post("/admin/contact-messages/:id/reply", requireAdmin, replyToContactMessage);
router.delete("/admin/contact-messages/:id", requireAdmin, deleteContactMessage);
router.get("/admin/users", requireAdmin, getAllUsers);

router.get("/", getHomeData);
router.get("/my-posts", getMyPosts);
router.get("/posts/:id", getPostById);
router.post("/posts", createPost);
router.delete("/posts/:id", deletePost);
router.put("/posts/:id", updatePost);

// Contact (public)
router.post("/contact", submitContactMessage);

// Social Routes
router.post("/posts/:id/like", likePost);
router.post("/posts/:id/comments", addComment);
router.post("/posts/:id/comments/:commentId/reply", replyToComment);
router.post("/posts/:id/report", reportPost);
router.post("/follow", followUser);

// Notifications
router.get("/notifications/:userId", getNotifications);
router.put("/notifications/:id/read", markNotificationRead);
router.delete("/notifications/:id", deleteNotification);

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
