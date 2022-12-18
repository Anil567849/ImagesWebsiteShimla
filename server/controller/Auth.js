const bcrypt = require('bcrypt');
const User = require("../model/userSchema");
const passport = require('passport');

class AuthController{

    async signUp(req, res){
       
        const { name, password, cpassword, phone, email } = req.body;


        if (!name || !email || !password || !cpassword) {
            return res.status(422).json({ error: "Please Fill All Field" });
        }

        User.findOne({ email: email }).then(async (userExist) => {

            if (userExist) {
                return res.status(422).json({ error: "user already exists" });
            } else if (password !== cpassword) {
                return res.status(422).json({ error: "user invalid" });
            }

            const createNewUser = new User(req.body);


            try {

                const result = await createNewUser.save();
                if(result){
                    const token = await result.generateAuthToken();
                    res.cookie("jwttoken", token, {
                        httpOnly : true
                    });
                    const userId = result._id.toString();
                    res.cookie('userId', userId);
    
                    return res.status(201).json({ message: "user created successfully" });
                }
            } catch (error) {
                return res.status(500).json({ error: "failed register " + err });
            }

        }); 
    }

    async login(req, res){

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ err: "please fill all fields" });
        }

        // console.log(email, password);

        try {
            const result = await User.findOne({ email: email });
            // console.log(result);
            if (result) {
            // console.log(token);

                bcrypt.compare(password, result.password, async function (err, r) {
                    if (!err) {
                    // r = either true or false
                        if(r){

                            // we can get generateAuthToken() using our schema check userSchema.js / [as SchemaName.static.functionname]
                            const token = await result.generateAuthToken();

                            res.cookie("jwttoken", token, {
                                httpOnly : true
                            });
                            const userId = result._id.toString();
                            res.cookie('userId', userId);
                            return res.status(200).json({userId});
                        }else{
                            return res.status(400).json({'err auth' : 'invalid'});
                        }
                    }else {
                        return res.status(422).json({ error: "signin auth.js " + err });
                    }
                });

            } else {
                return res.status(422).json({ error: "invalid credentials" });
            }
        } catch (error) {
            console.log("error auth.js " + error);
        }
    }


    async logout(req, res){        
        // console.log("log out");
        res.clearCookie('jwttoken', {path : '/'});
        res.clearCookie('userId', {path : '/'});
        res.status(200).json({'loggedOut' : true}); 
    }   


    async googleSignin(req, res){
        // console.log(req.user);
        if(!req.user){      
            res.redirect('http://localhost:3000/login');
        }else{
            const {userId, token} = req.user;
            res.cookie("jwttoken", token, {
                httpOnly : true
            });

            res.cookie('userId', userId);
            res.redirect('http://localhost:3000/');
        }
    }


}
    
module.exports = new AuthController();