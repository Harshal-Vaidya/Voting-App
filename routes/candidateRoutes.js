const express = require("express");
const router = express.Router();

const Candidate = require('../models/candidate.js');
const User = require('../models/user.js');
const { jwtAuthMiddleware,generateToken } = require("../jwt.js");
       



const checkAdminRole = async (userId) =>{
  try{
        const user = await User.findById(userId);
        console.log(user);
        return user.role === 'admin';
  }catch(err)
  {
    return false;
  }

}

// POST route to add candidate
router.post('/',jwtAuthMiddleware, async (req, res) => {
    try{
      console.log("Check if this is working");
      if(! await checkAdminRole(req.user.id)){
        console.log("Check if this is working 2" , req.user.id);
        return res.status(403).json({msg:'User does not have admin role'});
      }
    const data = req.body;
  
    const newCandidate = new Candidate(data);
  
    const response = await newCandidate.save();

    
    console.log("User Data Saved");
    res.status(200).json({response: response});
    
    }
    catch(error){
      console.log(error);
      res.status(500).json(error);
    }
  })
  
  


  // Update Candidate data
  router.put('/:candidateID',jwtAuthMiddleware ,async (req,res)=>{
    try{

      if(! await checkAdminRole(req.user.id)){
        return res.status(403).json({msg:'User does not have admin role'});
      }
    const candidateID = req.params.candidateID;
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(candidateID,updatedCandidateData,{
      new:true,
      runValidators:true
    })
    if(!response) res.json(404).json({error:'Candidate not found'});
    else{
      res.status(200).json(response);
    }
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
  })
  
  



  // Delete candidate
router.delete('/:candidateID',jwtAuthMiddleware, async (req, res)=>{
    try{
      if(! await checkAdminRole(req.user.id)){
        return res.status(403).json({msg:'User does not have admin role'});
      }
      const candidateID = req.params.candidateID;

      const response = await Candidate.findByIdAndDelete(candidateID);
      if(!response)
      {
        res.status(404).json({error: 'Candidate not found'});
      }
      else{
        res.status(200).json({response});
      }

    }
    catch(err)
    {
        console.log("Data retrieval failed");
        res.status(500).json(err);
    }

  })


  //Voting functionality
  router.post('/vote/:candidateID',jwtAuthMiddleware,async (req,res)=>{

    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try{
      const candidate = await Candidate.findById(candidateID);

      if(!candidate){
        return res.status(404).json({msg:'Candidate not found'});
      }

      const user =  await User.findById(userId);
      if(!user){
        return res.status(404).json({msg:'User not found'});
      }
      if(user.isVoted)
      {
        return res.status(400).json({msg:'You have already voted'});
      }
      if(user.role=='admin')
      {
        return res.status(403).json({msg:'Admin is not allowed to vote'});
      }

      //Update the candidate document
      candidate.votes.push({user: userId});
      candidate.voteCount++;
      await candidate.save();

      //Update the user document
      user.isVoted = true;
      await user.save();

      res.status(200).json({msg:'Vote saved'});

    }catch(err){
      console.log(err);
      res.status(500).json({error:'Internal Server Error'});
    }
  })

  router.get('/vote/count', async (req,res)=>{
    try{
       // Find all candidates and sort them by voteCount in descending order
       const candidate = await Candidate.find().sort({voteCount: 'desc'});

       // Map the candidates to only return their name and voteCount
       const voteRecord = candidate.map((data)=>{
           return {
               party: data.party,
               count: data.voteCount
           }
       });

       return res.status(200).json(voteRecord);
    }catch(err){
      console.log(err);
      res.status(500).json({error:'Internal Server Error'});
    }
  })
  

  // Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
  try {
      // Find all candidates and select only the name and party fields, excluding _id
      const candidates = await Candidate.find({}, 'name party -_id');

      // Return the list of candidates
      res.status(200).json(candidates);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

  
  

module.exports = router;  