const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res,next) =>{

    //first check if request header has authorization or not
    console.log("Request header is",req.headers.authorization);
    const authorization = req.headers.authorization
    console.log(authorization);
    if(!authorization){
        return res.status(401).json({error:'Token not found'});
    }
    
    //Extract the jwt token from the request header 
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error:'Unauthorized'});

    try{
        //Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Attach the userinformation to request object
        req.user = decoded;
        next();

    }catch(err){
        console.log(err);
        res.status(401).json({error:'Unauthorized'});
    }
}



//Function to generate JWT token
const generateToken = (userData) =>{
    //Generate a jwt token using user data
    return jwt.sign(userData, process.env.JWT_SECRET)

}
module.exports = {jwtAuthMiddleware,generateToken};