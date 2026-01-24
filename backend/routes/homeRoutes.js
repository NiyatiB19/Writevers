import { getHomeData, getPostById, createPost, signup, login, getUserProfile, updateUserProfile, likePost, addComment, deletePost, updatePost } from "../controllers/homeController.js";
import express from "express";

const router = express.Router();

router.get("/", getHomeData);
router.get("/posts/:id", getPostById);
router.post("/posts", createPost);
router.delete("/posts/:id", deletePost);
router.put("/posts/:id", updatePost);

// Social Routes
router.post("/posts/:id/like", likePost);
router.post("/posts/:id/comments", addComment);

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

export default router;
