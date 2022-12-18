
const mongoose = require('mongoose');


const url = process.env.DATABASE_URL;


mongoose.connect(url, (err) => {
    if(err){
        console.log('db not connect');
    }else{
        console.log('db success');
    }
})