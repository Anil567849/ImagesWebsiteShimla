const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    images : {
        imageId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
        },
        imageKey : {
            type : String,
            required : true,
        },
        imageUrl : {
            type : String,
            required : true,
        },
        imagePreSignedUrl : {
            type : String,
            required : true,
        }
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
    }
});

const Cart = mongoose.model('cart', CartSchema);
module.exports = Cart;