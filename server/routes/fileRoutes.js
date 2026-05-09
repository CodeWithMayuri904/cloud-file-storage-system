import express from "express";
import { uploadFile, getFiles } from "../controllers/fileController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getFiles);

export default router;