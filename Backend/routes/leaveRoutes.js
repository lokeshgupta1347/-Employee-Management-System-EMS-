import { Router } from "express";
import { protect, protectAdmin } from "../middleware/auth.js";
import {  createLeaves, getLeaves, updateLeavesStatus } from "../controllers/leaveController.js";

const leaveRouter = Router();

// Route to handle leave applications
leaveRouter.post("/", protect, createLeaves);

// Route to retrieve leave records
leaveRouter.get("/", protect, getLeaves);

// Route for admin to approve or reject leave applications
leaveRouter.patch("/:id", protect, protectAdmin, updateLeavesStatus);

export default leaveRouter;