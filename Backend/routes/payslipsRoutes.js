import { Router } from "express";
import { protect, protectAdmin } from "../middleware/auth.js";
import { createPayslip, getPayslips, getPayslipById } from "../controllers/payslipController.js";

const payslipRouter = Router();

// Route for admin to generate a new employee payslip
payslipRouter.post("/", protect, protectAdmin, createPayslip);

// Route to retrieve a list of all payslips
payslipRouter.get("/", protect, getPayslips);

// Route to fetch a specific payslip by its unique ID
payslipRouter.get("/:id", protect, getPayslipById);

export default payslipRouter;