const mongoose = require('mongoose');
const imagesSchema = require('../model/imagesSchema');
const Payment = require('../model/paymentSchema');
const Cart = require('../model/cartSchema')
const DownloadedFile = require('../model/downloadedFileSchema');
const path = require('path');
const fs = require('fs');
const EventsDetail = require('../model/allEventsDetailSchema');


class DatabaseController{

    async storeData(req, res){    
        const {data, folderName, eventDate, imageUrl} = req.body;   
        // console.log(req.body);
        const events = {
            'eventName' : folderName,
            imageUrl,
            eventDate,
        }
        try{
            const Images = mongoose.model(folderName, imagesSchema);
            await Images.insertMany(data, {ordered : false}); // ordered false hone se database m unordered way m data set hoga and ager koi duplicate content insert hota h to ye function stop nhi hoga duplicate ko skip krega or aage ke contents ko insert krega
            const addEvent = new EventsDetail(events);
            addEvent.save().then(()=>{
                return res.status(200).json({"message" : "data saved in DB"})
            }).catch((err)=>{
                return res.status(400).json({"message" : err});
            })

        }catch(err){
            if(err.code == 11000){
                return res.status(200).json({"message" : "data already exist"});
            }
            return res.status(400).json({"message" : err});
        }
        
    }


    async getAllImages(req, res){
        
        const c = req.body.eventName.toString().toLowerCase();
        const connection = mongoose.connection;

          const collection  = connection.db.collection(c + '/');
          collection.find({}).toArray(function(err, data){
              if(!err){
                return res.status(200).json({'allImages' : data});
              }else{
                return res.status(400).json({'error database.js' : err});
              }
          });
        
    }

    async getAllEventsDetail(req, res){

        //   EventsDetail.find()(function(err, data){
        //       if(!err){
        //         return res.status(200).json({'eventsDetail' : data});
        //       }else{
        //         return res.status(400).json({'error database.js' : err});
        //       }
        //   });

          const data = await EventsDetail.find();
          if(data){
            return res.status(200).json({'eventsDetail' : data});
          }else{
            return res.status(400).json({'error no data found' : err});
          }
        
    }


    async addToCart(req, res){
        const {userId, imageKey, imageId, imageUrl, imagePreSignedUrl} = req.body;
        const cartItem = {
            imageId,
            imageKey,
            imageUrl,
            imagePreSignedUrl,
        }
        try {
            const addItem = new Cart({
                images : cartItem,
                user : userId
            })
    
            addItem.save().then(() => {
                return res.status(200).json({'ok' : 'item saved'});
            }).catch((err) => {
                return res.status(400).json({err});
            })
        } catch (error) {
            return res.status(400).json(error);
        }


    }

    async removeFromCart(req, res){
        const {cartImgId} = req.body; // cart item ki Id h ye 
        // console.log(cartImgId);
        try {
            const del = await Cart.deleteOne({'_id' : cartImgId});
            return res.status(200).json(del);
        } catch (error) {
            return res.status(400).json(error);
        }
    }


    async getFromCart(req, res){
        const id = req.body.userId;
        // console.log(req.body);
        try {   

            Cart.find({'user' : id}).then((data) => {
                // console.log(data);
                return res.status(200).json(data);
            }).catch((err) => {
                return res.status(400).json(err);
            })
            
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    async getKeysFromCart(req, res){
        const id = req.body.userId;
        // console.log(req.body);
        try {   

            Cart.find({'user' : id}, 'images.imageKey -_id').then((data) => {
                let keys = [];
                for(let key of data){
                    keys.push(key.images.imageKey);
                }
                return res.status(200).json(keys);
            }).catch((err) => {
                return res.status(400).json(err);
            })
            
        } catch (error) {
            return res.status(400).json(error);
        }
    }


    async storePaymentId(userId, razorpay_order_id, razorpay_payment_id, razorpay_signature){
        const addId = new Payment({
            userId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });

        const res = await addId.save();
        if(res){
            return true;
        }else{
            return false;
        }
    }


    async checkPaymentIdExist(req, res){
        const {payId} = req.body;
        const found = await Payment.findOne({'razorpay_payment_id' : payId});
        if(found){
            return res.status(200).json({"found" : true});
        }else{
            return res.status(400).json({"found" : false});
        }

    }

    // call when files are downloaded 
    async storeDownloadFile(req, res){
        
        const {userId, payId, lastAccessTime} = req.body;
        
        const file = new DownloadedFile({
            userId, payId, lastAccessTime
        })
        
        const result = await file.save();
        if(result){
            return res.status(200).json({'saved': true});
        }else{
            return res.status(400).json({'saved': false});

        }

    }

    async getDownloadedFiles(req, res){
        const {userId} = req.body;
        // console.log(userId);
        try {

            // DELETE ALL FILES WHICH IS EXISTS MORE THAN TWO DAYS 
            const delFile = await DownloadedFile.find({}).where('lastAccessTime').lt(Date.now());
            for(let val of delFile){
                const payId = val.payId;
                const location = path.join(__dirname, "..", "..", "client", "public", 'download', `${payId}.zip`);
                fs.unlink(location, function(err) {
                    if(err && err.code == 'ENOENT') {} // File doesn't exist
                });

                await DownloadedFile.deleteOne({'payId' : payId});
            }

        
        } catch (error) {
                console.log({'database.js' : error});
        }finally{

            // const payIds = await DownloadedFile.find(userId);
            const payIds = await DownloadedFile.find({userId}, null, {sort: {purchaseDate: -1}});
            if(payIds){
                return res.status(200).json({'foundPayIds' : payIds});
            }else{
                return res.status(400).json({'foundPayIds' : false});
            }
        }        
        

    }

    async clearAllCartItems(req, res){
        
        const {userId} = req.body;
        try {
            const result = await Cart.deleteMany({user : userId});
            res.status(200).json({result});
        } catch (error) {
            return res.status(400).json({error});
        }
    }

    
}

module.exports = new DatabaseController();