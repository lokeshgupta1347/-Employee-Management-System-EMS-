import mongoose from "mongoose";

const employeeSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  basicSalary: { type: Number, default: 0 },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  employmentStatus: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  joinDate: { type: Date, required: true },
  isDeleted: { type: String, required: false },
  bio:{type :String,default:""},
  department:{type:String, }
    

},  
{ timestamps: true })

const Employee=mongoose.models.Employee || mongoose.model("Employee",employeeSchema)   //agar model phele hi ban chuka h to usse use karo  || warna new create karo  

export default Employee;