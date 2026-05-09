import express from "express";
import { uploadFile, getFiles, deleteFile } from "../controllers/fileController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getFiles);
router.delete("/:id", protect, deleteFile);

export default router;