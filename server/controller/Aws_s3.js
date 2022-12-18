const AwsS3 = require('aws-sdk');
const async = require('async');
const fs = require('fs');
// const stream = require('stream');
const path = require('path');
// const archiver = require('archiver');
const s3Zip = require('s3-zip');
const io = require('../app');





AwsS3.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.S3_REGION,
});
const s3 = new AwsS3.S3(); // create s3 client



class AwsS3Controller{

    async getAllEventsName(req, res){

        const bucketParams = {
            Bucket : process.env.S3_BUCKET_WATERMARK_NAME,
            Delimiter: '/', // it will give only folders
            MaxKeys : 10, // fetch 10 events only
          };

        s3.listObjects(bucketParams, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              return res.status(200).json({data : data.CommonPrefixes});
            }
          });
        

    }

   

    async getAllImages(req, res){
      const folderName = req.body.folderName;
      // console.log(folderName);
      const bucketParams = {
        Bucket : process.env.S3_BUCKET_WATERMARK_NAME,
        Prefix : folderName,
      };
      

      try{
        let datas = [];
        s3.listObjects(bucketParams, function(err, data) {

          if (err) return res.status(400).json({"error awss3.js " : err});
          if(data.Contents.length <= 0) return res.status(200).json({'message' : 'empty'})

          // console.log(data);
          async.eachSeries(data.Contents, function(fileObj, callback){
                var key = fileObj.Key;
                  // console.log('Fething: ' + key);
            
                var fileParams = {
                  Bucket: process.env.S3_BUCKET_WATERMARK_NAME,
                  Key: key
                }
                s3.getSignedUrl('getObject', fileParams, (e, url) => {
                    if(!e){
                      datas.push({
                        'key' : key,
                        'url' : url
                      });
                      callback();
                    }else{
                      callback(e);  
                    }
                  });
            }, function(error) {
            if (error) {
              console.log('Failed: ' + error);
              return res.status(400).json({"error" : error})
            } else {
              // console.log('Finished');
              return res.status(200).json(datas);
            }
          });
          
        });
      }catch(err){
        return res.json({"error hai" : err});
      }
      
    }


    async downloadCartImages(req, res){

        const {imagesKey, payId} = req.body;

        /*
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
          });
        */

        const output = fs.createWriteStream(path.join(__dirname, "..", "..", "client", "public", 'download', `${payId}.zip`));

        try {

          // const archive = await s3Zip.archive({s3, bucket : process.env.S3_BUCKET_NAME, preserveFolderStructure: true}, '', imagesKey).pipe(output);
          const archive = await s3Zip.archive({s3, bucket : process.env.S3_BUCKET_NAME, preserveFolderStructure: true}, '', imagesKey);

          archive.pipe(output);    
          archive.on('end', () => {
              io.emit('archive_created', true);
          });

          return res.status(200).json({"downloaded" : true});
          /*
          for(let key of imagesKey){
            key = key.imgKey;
            
            const passthrough = new stream.PassThrough();
            s3.getObject({
                  Bucket: process.env.S3_BUCKET_NAME,
                  Key: key
              }).createReadStream().pipe(passthrough);

              // name parameter is the name of the file that the file needs to be when unzipped.
            archive.append(passthrough, { name: key }); 
          }          

          // res is the response object in the http request. You may want to create your own write stream object to write files in your local machine
          archive.pipe(output);
          
          // use finalize function to start the process
          archive.finalize();
          */

        } catch (error) {
          res.status(400).json({'error aws_s3.js' : error});
        }

    }


}
    
module.exports = new AwsS3Controller();