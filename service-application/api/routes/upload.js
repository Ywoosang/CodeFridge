const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');
const { File,Folder } = require('../models'); 
const express = require('express');
const router = express.Router(); 
// AWS Config 
AWS.config.update({
    accessKeyId : process.env.S3_ACCESS_KEY_ID,
    secretAccessKey : process.env.S3_SECRET_ACCESS_KEY,
    // s3 : region 상관없음
    region: 'ap-northeast-2',
});

const storage = multerS3({
    s3: new AWS.S3(),
    bucket : 'ywoosang-s3',
    async key(req,file,cb) {
        // 정규표현식으로 폴더 경로 검사
       try{
        // path 를 저장할때 Date 붙여서 구분하도록
        const userId = req.user.id; 
        const fileName = path.basename(file.originalname);  
        
        const filePathName = `${Date.now()}-${file.originalname}`;
        // 상위폴더 및 경로 확인
        const filePath = file.originalname.split('/');
        const pathLength = filePath.length; 
        console.log(req.data);
        // 오브젝트에 저장
        req.data = {}; 
        req.data.folderName = null;
        if( pathLength > 2){
            // 폴더 안 폴더에 있는 파일일 경우
            const folderName = filePath[pathLength-2];
            req.data.folderName = folderName;
        } else if(pathLength == 2){
            // 최상위 폴더일 경우
            req.data.folderName = folderName;
        } else {
            // 파일일 경우
        }
        // await File.create({
        //     name : fileName,
        //     path : filePath,
        //     isFolder : 1,
        //     userId,
        // }); 
        req.data.fileName = fileName;
        cb(null,filePathName); 
       } catch(err){
            console.log(err);            
       }
    }}); 


const upload = multer({
    storage,
    preservePath: true,
    // limits : { fileSize : 6 * 1024 * 1024}, 
}).single('file');

fileUpload = (req , res , next ) => {
    upload(req, res, (err) => {
        try {
            if (err instanceof multer.MulterError) {
                console.log(err)
                return res.status(404).json({ message: "올바른 파일을 업로드해주세요" });
            }
            if(err){
                console.log(err)
            }
            // 업로드 완료한 파일 
            const fileUrl = req.file.location;
            const fileName = req.data.fileName;
            const folderName = req.data.folderName;
            console.log(fileUrl,fileName,folderName);

            return res.json({ msg: 'uploaded' });
        } catch (err) {
            console.error(err);
            next(err); 
        }
    })
}

router.post('/file',fileUpload); 

module.exports = router;
 