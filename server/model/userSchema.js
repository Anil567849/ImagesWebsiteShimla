const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        
    },
    email : {
        type : String,
        required : true,
        unique : true,

    },
    phone : {
        type : Number,
        
    },
    password : {
        type : String,
        required : true,
        
    },
    cpassword : {
        type : String,
        required : true,
        
    },
    oAuth : { // true when someone signwith google etc.
        type : Boolean,
        default : false,
    },
    date : {
        type : Date,
        default : Date.now
    },
    tokens_db : [
        {
            token : {
                type : String,
                require : true
            }
        }
    ]

});

//this func call before save called anywhere in this project
userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            user.cpassword = hash;
            next();
        });
    });
});


userSchema.methods.generateAuthToken = async function(){
    // console.log(this._id);
    try{
        let our_token = await jwt.sign({_id : this._id.toString()}, process.env.SECRET_KEY);
        this.tokens_db = this.tokens_db.concat({token : our_token});
        await this.save();
        return our_token;
    }catch(err){
        console.log({error : "userschema.js " + err })
    }
}



userSchema.statics.generateGooglePassword = async function(){
    
    return bcrypt.hashSync(process.env.GOOGLE_TEMP_PASSWORD, 10);

}




const User = mongoose.model("users", userSchema);

module.exports = User;





