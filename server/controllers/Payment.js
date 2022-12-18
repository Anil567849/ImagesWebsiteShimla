const Razorpay = require('razorpay');
const crypto = require("crypto");
const DatabaseController = require('../controllers/Database');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

class PaymentContoller{

    async checkout(req, res){

        const {amount} = req.body;
        try {
            const options = {
                amount: (parseInt(amount) * 100),  // amount in the smallest currency unit
                currency: "INR",
            };
            const order = await instance.orders.create(options);
            // console.log(order);
            res.status(200).json({"payment" : order});
        } catch (error) {
            res.status(400).json({"payment failed" : error});
        }

    } 
    
    
    async paymentVerification(req, res){
        // console.log("pay verf", req.body);
        const userId = req.cookies.userId;
        // console.log(userId);
        const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;

        const body =razorpay_order_id + "|" + razorpay_payment_id;

        var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                        .update(body.toString())
                                        .digest('hex');
                                        
        if(expectedSignature === razorpay_signature){
            // save in db first 

            const saved = DatabaseController.storePaymentId(userId, razorpay_order_id, razorpay_payment_id, razorpay_signature);

            if(saved){
                return res.redirect(`/cart?reference=${razorpay_payment_id}`);
            }else{
                return res.status(400).json({"payment not verify db failed" : false});
            }

        }else{
            return res.status(400).json({"payment not verify" : false});
        }
    }


    async getKey(req, res){
        res.status(200).json({"key" : process.env.RAZORPAY_KEY_ID});
    }

    
}

module.exports = new PaymentContoller();