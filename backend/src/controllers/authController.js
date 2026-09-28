import bcrypt from "bcryptjs";
 import jwt from "jsonwebtoken";

 import User from "../models/User.js";
 //register
  const registerUser =async (req, res,next)=>{
    try{
        const {name, email, password}= req.body;
        // check if user already exists 
        const existinguser= await User.findOne({email});
        if(existinguser){
            return res.status(400).json({
                success:false,
                message:"user already exists",

            });

        }
        // hash password
         const hashedPassword =await bcrypt.hash(password,10);
         // create user
          const user= await User.create({
            name,
            email,
            password:hashedPassword,

          });
           res.status(201).json({
            success:true,
            message:"user registered succesfully",
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
            },
           });

    }catch(error){
        next(error);

    }
  };
   // login 
 const loginUser= async(req ,res,next )=>{
    try{
        const {email, password}= req.body;
        // find user
         const user = await User.findOne({email});
          if(!user){
            return res.status(401).json({
                success:false,
                message:"invalid email or password",

            });
          

          }
             // compare password
            const isPasswordCorrect =await bcrypt.compare(
                password,
                user.password
            );
            if(!isPasswordCorrect){
                return res.status(401).json({
                    success:false,
                    message:"invalid email or password",

                });
            }
            // generate JWt
            const token= jwt.sign(
                {
                    userId:user._id,

                },
                process.env.JWT_SECRET,

                {
                    expiresIn:"7d",

                }
            );
             res.status(200).json({
                success:true,
                message:"login succesful",
                token,
                user:{
                     id:user._id,
                     name:user.name,
                     email:user.email,

                },

             });

    }catch(error){
        next(error);

    }
 };
 // get current users 
 const getCurrentUser =async(req,res,next )=>{
    try{
        const user= await User.findById(req.user.userId).select("-password");
         if(!User){
            return res.status(404).json({
                success:false,
                message:"user not found",
                error:null,

            });
         }
         res.status(200).json({
            success:true,
            message:"current user fetched succesfully",
            data:{
                 id :user._id,
                 name:user.name,
                 email:user.email,

            },

         });
    }catch(error){
        next(error);

    }
 };

  export default {
    registerUser,
    loginUser,
     getCurrentUser,
     
    

  };
