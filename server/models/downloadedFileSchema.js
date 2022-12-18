const mongoose = require('mongoose');

const DownloadedFileSchema = new mongoose.Schema({

    userId : {
        type : String,
        required : true,
    }, 
    
    payId : {
        type : String,
        required : true,
    }, 
    
    lastAccessTime : {
        type : String,
        required : true,
    }, 
    
    purchaseDate : {
        type : String,
        default : Date.now
    }, 
    

});


const DownloadedFile = mongoose.model('downloaded_files', DownloadedFileSchema);
module.exports = DownloadedFile;