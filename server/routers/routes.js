const express = require("express");
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const AwsS3Controller = require('../controllers/Aws_s3');
const DatabaseController = require("../controllers/database");
const PaymentController = require('../controllers/Payment');
const AuthController = require('../controllers/Auth');
const passport = require('passport');



router.get("/home", authenticate, async (req, res) => {
  res.send(req.rootUser);
});






// AUTHENTICATION 
router.post("/register", AuthController.signUp);
router.post("/login", AuthController.login);
router.get('/logout', AuthController.logout);
// GGOOLE SIGNIN 
router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }), AuthController.googleSignin);
router.get('/google', passport.authenticate('google', ['profile', 'email']));







// AWS S3 
// get All Events Name from AWS s3
router.get("/getAllEventNameFromAWSS3", AwsS3Controller.getAllEventsName);
router.post("/getAllImagesFromAWSS3", AwsS3Controller.getAllImages);
router.post('/downloadFiles', AwsS3Controller.downloadCartImages);







// DATABASE 
// store AWSS3 images signedurl in DB;
router.post("/storeInDB", DatabaseController.storeData);
// get all images from DB 
router.post('/getAllImagesFromDB', DatabaseController.getAllImages);
// get all events detail from DB 
router.get('/getAllEventsDetailFromDB', DatabaseController.getAllEventsDetail);
// add/get to/from db
router.post('/addImagesInCartInDB', DatabaseController.addToCart);
router.post('/getAllCartItemsFromDB', DatabaseController.getFromCart);
router.post('/getAllCartItemsKeyFromDB', DatabaseController.getKeysFromCart);
router.post('/removeCartItemFromDB', DatabaseController.removeFromCart);
router.post('/clearCartFromDB', DatabaseController.clearAllCartItems);
//get payment id from DB
router.post('/getPaymentIdFromDb', DatabaseController.checkPaymentIdExist);
// get and store payment Id 
router.post('/getDownloadedFilesOfUserFromDB', DatabaseController.getDownloadedFiles);
router.post('/storePaymentIdInDB', DatabaseController.storeDownloadFile);






// PAYMENT RAZORPAY
router.post('/checkout', PaymentController.checkout);
router.post('/paymentVerification', PaymentController.paymentVerification);
//get razorpay key
router.get('/getKey', PaymentController.getKey);





module.exports = router;
