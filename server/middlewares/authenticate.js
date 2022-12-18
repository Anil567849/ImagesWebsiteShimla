



const jwt = require('jsonwebtoken');
const User = require("../models/userSchema");

const authenticate = async (req, res, next) =>{

    // console.log("authencticated")

    try{

        const tkn = req.cookies.jwttoken;

        // console.log("tkn " + tkn);

        const verifyToken = jwt.verify(tkn, process.env.SECRET_KEY);    

        // console.log("token " + verifyToken._id);

        const rootUser = await User.findOne({_id : verifyToken._id, "tokens_db.token" : tkn});

        if(!rootUser){
            throw new Error("user not found");
        }

        req.token = tkn;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();

    }catch(err){
        res.status(401).json({err});
    }

}


module.exports = authenticate;