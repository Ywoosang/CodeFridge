const AWS = require('aws-sdk');
const { File,Folder,Code } = require('../models'); 
const fs = require('fs'); 
const iconvLite = require('iconv-lite');

// AWS Config 
AWS.config.update({
    accessKeyId : process.env.S3_ACCESS_KEY_ID,
    secretAccessKey : process.env.S3_SECRET_ACCESS_KEY,
    // s3 : region 상관없음
    region: 'ap-northeast-2',
});

const s3 = new AWS.S3(); 
 
exports.fileDownload = async(req,res,next) =>{ 
    try{
        const id = req.query.id;
        const file = await File.findOne({
            where: {
                id
            }
        });
       
        const Key = file.awsKey;
        // 버킷의 데이터를 읽어온다. 
        // const data =    .
        const f = s3.getObject({
            Bucket : 'ywoosang-s3',
            Key 
        }).createReadStream(); 
        res.setHeader('Content-disposition', 'attachment; filename=' + getDownloadFilename(req,file.name));
        
        function getDownloadFilename(req, filename) {
            var header = req.headers['user-agent'];
            if (header.includes("MSIE") || header.includes("Trident")) { 
                return encodeURIComponent(filename).replace(/\\+/gi, "%20");
            } else if (header.includes("Chrome")) {
                return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
            } else if (header.includes("Opera")) {
                return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
            } else if (header.includes("Firefox")) {
                return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
            }
            return filename;
        }
        res.setHeader('Content-type',file.mimetype.toString()); // 파일 형식 지정
        f.pipe(res); 

    } catch (err){
        next(err); 
    }
}