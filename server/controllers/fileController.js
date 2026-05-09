import File from "../models/File.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import crypto from "crypto";

const generateFileName = (originalname) => {
  return crypto.randomBytes(16).toString("hex") + "-" + originalname;
};

export const uploadFile = async (req, res) => {
  try {

    //debugging logs
    console.log("USER:", req.user);
    console.log("FILE:", req.file);

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = generateFileName(file.originalname);

    // Upload params
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload to S3
    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // Save in DB
    const newFile = await File.create({
      user: req.user._id,
      fileName: file.originalname,
      fileUrl,
      fileKey: fileName,
    });

    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find({
      user: req.user._id,
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};