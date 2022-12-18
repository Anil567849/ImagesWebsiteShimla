const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require('./model/userSchema');


passport.use(new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
			clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
			callbackURL: "/google/callback",
			scope: ["profile", "email"],
		},
		async function (accessToken, refreshToken, profile, callback) {
      		// console.log(profile);
			  User.findOne({ email: profile._json.email }).then(async (user) => {

				if (user) {
					const token = await user.generateAuthToken();
					const userId = user._id.toString();
					return callback(null, {token, userId});
				} else{			
					const name = profile._json.name;
					const email = profile._json.email;
					const password = await User.generateGooglePassword(); // generate temp password
					const createNewUser = new User({
						name, email, password, 'cpassword' : password, 'oAuth' : true
					});
		
					try {
		
						const result = await createNewUser.save();
						if(result){
							const token = await result.generateAuthToken();
							const userId = result._id.toString();
							return callback(null, {token, userId});
						}
						
					} catch (error) {
						return callback(error, null);
					}
					
				}
	
			});
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});