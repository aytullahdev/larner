const asyncHandler = require('express-async-handler')
const User = require('../modal/userModal')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Review = require('../modal/reviewModal')
const Course = require('../modal/courseModal')
const createUser = asyncHandler( async (req,res)=>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please all the valid Data!");
    }
    // Check user
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400);
        throw new Error("User already exists!");
    }
    // Hash password

    const salt  = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);

    // Create User

    const user = await User.create({
        name,email,password:hashPassword
    })

    if(user){
        res.status(201);
        res.json(user);
    }else{
        res.status(400);
        throw new Error("User not created please try again later!");å
    }

})
const loginUser = asyncHandler( async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(500);
        throw new Error("Provide all require field!");
    }

    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        res.status(200);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: getToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Cradential dosen't match!");
    }
}
)
const addReview = asyncHandler(async (req,res)=>{
     const {review,courseid} = req.body;
     if(!review || !courseid){
        res.status(400);
        throw new Error("Please provide all data");
     }
    //  console.log(req.user)
     const newReview = await Review.create({
        review,user:req.user._id,course:courseid
      })
     res.json(newReview);
})
const uploadContent = asyncHandler( async (req,res)=>{
    if (!req.file) {
        res.status(400);
        throw new Error("There is no file attached");
      }
     
    res.send(req.file);

   // console.log(req.file,req.body);
})

const addCourse = asyncHandler(async (req,res)=>{
    const {tittle,price,img} = req.body;
    if(!tittle || !price || !img){
       res.status(400);
       throw new Error("Please provide all data");
    }
    
    const newCourse = await Course.create({
        tittle,price,img
    })
    res.json(newCourse);
})
const getCourses = asyncHandler(async (req,res)=>{
   const courses = await Course.find({})
   res.json(courses)
})
const getReviews = asyncHandler(async (req,res)=>{
    const reviews = await Review.find({})
    res.json(reviews)
 })
const getMe = (req,res)=>{
    res.json(req?.user);
}
// Genarate token

const getToken = (id) =>{
    return jwt.sign({id}, process.env.DBPWD);
}

module.exports = { createUser , loginUser , getMe, uploadContent, addReview, addCourse, getCourses, getReviews }