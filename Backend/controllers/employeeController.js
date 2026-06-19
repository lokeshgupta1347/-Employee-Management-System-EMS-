import Employee from "../models/Employee.js";
import bcrypt from 'bcrypt';
import User from "../models/user.js";


// Get employees
//GET /api/employees
export const getEmployees=async (req,res)=>{
    try {
    const { department } = req.query; //destructuring value of department 
    const where = {};
    if (department) where.department = department;

    const employees = await Employee.find({...where, isDeleted: { $ne: true }}).sort
      ({createdAt: -1}).populate("userId", "email role").lean();

    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      user: emp.userId ? {email: emp.userId.email, role: emp.userId.role} : null
    }))

    return res.json(result)


  } catch (error) {
    // Error handling logic goes here
    return res.status(500).json({error:"Failed to fetch employees"})
  }
}




//Create Employee
//POST /api/employees
export const createEmployees=async (req,res)=>{
    try {
        const { firstName, lastName, email, phone, position,
      department, basicSalary, allowances, deductions, joinDate,
      password, role, bio } = req.body;

    if(!email || !password || !firstName || !lastName || !position || !joinDate){
        return res.status(400).json({ error: "Missing required fields" });
    }

    const parsedJoinDate = new Date(joinDate);
    if(isNaN(parsedJoinDate.getTime())){
        return res.status(400).json({ error: "Invalid join date" });
    }

    const hashed=await bcrypt.hash(password,10)
    const user=await User.create({
        email,password:hashed,
        role:role || "EMPLOYEE"
    })

    let employee;
    try {
        employee = await Employee.create({
          userId: user._id,
          firstName,
          lastName,
          email,
          phone,
          position,
          department: department || "Engineering",
          basicSalary:Number(basicSalary) || 0,
          allowances:Number(allowances) || 0,
          deductions:Number(deductions) || 0,
          joinDate: parsedJoinDate,
          bio: bio || "",
        })
    } catch(empError) {
        // Rollback: delete the user if employee creation fails
        await User.findByIdAndDelete(user._id);
        throw empError;
    }

    return res.status(201).json({success:true,employee})


        
    } catch (error) {
        if(error.code===11000){
            return res.status(400).json({error:"Email already exits"})
        }
        console.error("Create employee error:",error)
        return res.status(500).json({error:"Failed to create employee"});

        
    }
    
}

//Update Employee
//PUT /api/employees/:id
export const updateEmployees=async (req,res)=>{

    try {

        const {id} =req.params;


        const { firstName, lastName, email, phone, position,
      department, basicSalary, allowances, deductions, 
      password, role, bio, employmentStatus } = req.body;

    const employee=await Employee.findById(id);
    if(!employee) return res.status(404).json({error: "Employee not found"})

    

     await Employee.findByIdAndUpdate(id,{
      
      firstName,
      lastName,
      email,
      phone,
      position,
      department: department || "Engineering",
      basicSalary:Number(basicSalary) || 0,
      deductions:Number(deductions) || 0,
      employmentStatus:employmentStatus || "ACTIVE",
      bio: bio || "",

    })

    //update user record
    const userUpdate = { email }
    if(role) userUpdate.role = role;
    if(password) userUpdate.password = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(employee.userId, userUpdate)

    return res.json({success: true})


        
    } catch (error) {
        if(error.code===11000){
            return res.status(400).json({error:"Email already exits"})
        }
        console.error("Create employee error:",error)
        return res.status(500).json({error:"Failed to update employee"});

        
    }
    
}

//Delete Employee
//DELETE /api/employees/:id
export const deleteEmployees=async (req,res)=>{

    try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if(!employee) return res.status(404).json({ error:
    "Employee not found" });

    employee.isDeleted = true;
    employee.employmentStatus = "INACTIVE";
    await employee.save();
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete employee" });
  }


    
}