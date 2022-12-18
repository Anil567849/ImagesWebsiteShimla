const mongoose = require('mongoose');

const paymentSchmea = new mongoose.Schema({
    userId : {
        type : String,
        required : true,
    },
    razorpay_order_id : {
        type : String,
        required : true,
        unique : true,
    },
    razorpay_payment_id : {
        type : String,
        required : true,
        unique : true,
    },
    razorpay_signature : {
        type : String,
        required : true,
        unique : true,
    },
})


const Payment = mongoose.model('payment', paymentSchmea);
module.exports = Payment;