const express = require("express");
const router = express.Router();

const User = require('../models/user.js');

const {generateToken, jwtAuthMiddleware} = require('../jwt');



// SignUp route
router.post('/signup', async (req, res) => {
    try{
    const data = req.body;

     // Check if there is already an admin user
     const adminUser = await User.findOne({ role: 'admin' });
     if (data.role === 'admin' && adminUser) {
         return res.status(400).json({ error: 'Admin user already exists' });
     }

     // Validate Aadhar Card Number must have exactly 12 digit
     if (!/^\d{12}$/.test(data.aadharCardNumber)) {
      return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
    }

    // Check if a user with the same Aadhar Card Number already exists
    const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
    if (existingUser) {
        return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
    }
  
    // Create a new User document using the Mongoose model
    const newUser = new User(data);
  
    const response = await newUser.save();

    const payload = {id:response.id};
    const token = generateToken(payload);
    console.log("User Data Saved");
    res.status(200).json({response: response, token: token});
    
    }
    catch(error){
      console.log(error);
      res.status(500).json(error);
    }
  })
  
  
// Login Route
router.post('/login', async (req, res)=>{
    try{
        const {aadharCardNumber,password}=req.body;

         // Check if aadharCardNumber or password is missing
         if (!aadharCardNumber || !password) {
          return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
      }
        // Find the user by aadharCardNumber
        const user = await User.findOne({aadharCardNumber: aadharCardNumber})

        //If user does not exist or password doesnt match, return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:'Invalid username or password'});
        }

        //generate token
        const payload = {id: user.id};

        const token = generateToken(payload);

        // return token as response
        res.json({token})

    }
    catch(err){
      console.log(err);
      res.status(500).json({error : "Internal Server Error"});
    }
  })

  // Profile Route
  router.get('/profile',jwtAuthMiddleware ,async (req,res)=>{
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
  })
  
  



  // Change password
router.put('/profile/password',jwtAuthMiddleware, async (req, res)=>{
    try{
        // extract the id from token
        const userId = req.user.id;
        console.log(userId)
        const {currentPassword,newPassword} = req.body;
        
        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
          return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
      }
        
        //Find the user by userId
        const user = await User.findById(userId);

        //If password does not match return error
        if(!(await user.comparePassword(currentPassword))){
          
            return res.status(401).json({error:'Invalid username or password'});
        }

        //Update the user password
        user.password = newPassword;
        await user.save();

        console.log("Password changed successfully");
        res.status(200).json({message:'Password Updated'});

    }
    catch(err)
    {
        console.log("Data retrieval failed");
        res.status(500).json(err);
    }

  })
  

  
  

module.exports = router;  