import express from "express";
import {
  getUsers,
  updateUser,
  getUserById,
  deleteUser,
  createUser,
} from "../controllers/userControllers.js";

const router = express.Router();

// get users
router.get("/", getUsers);

// create user
router.post("/", createUser);

// update user
router.put("/:id", updateUser);

// get user by id
router.get("/:id", getUserById);

// delete user
router.delete("/:id", deleteUser);

export default router;
