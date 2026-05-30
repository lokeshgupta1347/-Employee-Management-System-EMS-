import express from "express";
import cors from "cors"
import "dotenv/config";
import multer from "multer";
import connectDB from "./config/db.js";

const app=express()
const Port=process.env.PORT || 4000;

//Middleware
app.use(cors())
app.use(express.json())
app.use(multer().none())

//Routes

app.get("/",(req,res)=>{
    res.send("Server is running")
})


await connectDB()
app.listen(Port, ()=>
    console.log(`Server running on port ${Port}`)
)