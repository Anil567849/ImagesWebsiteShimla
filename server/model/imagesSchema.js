const mongoose = require('mongoose');

const imagesSchema = new mongoose.Schema({
    key : {
        type : String,
        unique : true,
        
    },
    url : {
        type : String,
        unique : true,
    },
    eventDate : {
        type : String
    }

});

module.exports = imagesSchema;





