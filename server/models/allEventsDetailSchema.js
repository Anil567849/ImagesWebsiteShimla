const mongoose = require('mongoose');

const EventsDetailSchema = new mongoose.Schema({
    eventName : {
        type : String,
        required : true,
    },
    imageUrl : {
        type : String,
        required : true,
    },
    eventDate : {
        type : String,
        required : true,
    }
});

const EventsDetail = mongoose.model('all_events_details', EventsDetailSchema);
module.exports = EventsDetail;