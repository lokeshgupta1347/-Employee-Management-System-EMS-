import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { clockInOut, getAttendance } from "../controllers/attendanceController.js";

const attendanceRouter = Router();

// Route to handle clock-in and clock-out actions
attendanceRouter.post('/', protect, clockInOut);

// Route to retrieve attendance history
attendanceRouter.get('/', protect, getAttendance);

export default attendanceRouter;