const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');
const { File,Folder,Code } = require('../models'); 
 
// AWS Config 
AWS.config.update({
    accessKeyId : process.env.S3_ACCESS_KEY_ID,
    secretAccessKey : process.env.S3_SECRET_ACCESS_KEY,
    // s3 : region 상관없음
    region: 'ap-northeast-2',
});

// multer 
const storage = multerS3({
    s3: new AWS.S3(),
    bucket : 'ywoosang-s3',
    async key(req,file,cb) {
       try{
        // S3 저장할때 Date 붙여서 구분
        const filePathName = `${Date.now()}-${file.originalname}`;
        cb(null,filePathName); 
       } catch(err){
            console.log(err);            
       }
    }}); 

const upload = multer({
    storage,
    preservePath: true,
}).single('file');

// controller
exports.fileUpload = async(req , res , next ) => {
    upload(req, res, async (err) => {
        try {
            
            if (err instanceof multer.MulterError) {
                console.log(err)
                return res.status(404).json({ message: "올바른 파일을 업로드해주세요" });
            }
            if(err){
                console.log(err); 
            }
       
            if(!req.user.id){
                return res.json({msg:'expired'});
            } 
            // 업로드된 파일  
            const f = req.file; 
            // aws 에 업로드된 파일 주소 
            const fileUrl = f.location; 
            // 파일 정보
            const fileName = path.basename(f.originalname);   
            const filePath = f.originalname.split('/');
            const codeNumber =  req.body.num.substr(0,9);
            const pathLength = filePath.length; 
            const hierarchy = filePath.length-1; 

            // foreign key constraint 만족시키기 위해 생성
            const code = await Code.findOne({
                where : {
                    num : codeNumber,
                }
            })
            if(!code){
            await Code.create({
                num : codeNumber
            }); 
            }
            // 동적 파일 생성
            let idx = 1;
            for(fd of filePath.slice(0,filePath.length-2)){
                const tmp = await Folder.findOne({
                    where:{
                        ownerId : req.user.id,
                        name: fd,
                        hierarchy : idx,
                        codeNumber
                    }
                })
                if(!tmp){
                    await Folder.create({
                        ownerId : req.user.id,
                        name: fd,
                        hierarchy: idx,
                        codeNumber,
                    });
                }
                ++idx;
            }
            let folderName; 
            // 오브젝트에 폴더 및 파일정보 저장
            if( pathLength >= 2){
                // 폴더를 보유한 경우 
                folderName = filePath[pathLength-2]; 
            }
            // 단일 파일 업로드 처리
            if(!folderName){
                const file = await File.create({
                    ownerId : req.user.id,
                    fileUrl,
                    name : fileName,
                }); 
                return res.json({ msg: 'uploaded',file });
            };
            console.log('폴더이름 확인',folderName);
            // 소속 폴더 이름이 존재할 경우 폴더 업로드 처리
            const crrFolder = await Folder.findOne({
                where:{
                    ownerId : req.user.id,
                    name: folderName,
                    codeNumber,
                    hierarchy
                }
            }); 
            // 다중 파일 업로드 처리
            let folderId;
            if(!crrFolder){
                // 폴더 생성 
                const folder = await Folder.create({
                    ownerId : req.user.id,
                    name: folderName,
                    hierarchy,
                    codeNumber
                });
                folderId =  folder.id
            } else {
                folderId = crrFolder.id; 
            }
            // 데이터베이스에 파일 저장
            const file = await File.create({
                folderId,
                ownerId : req.user.id,
                fileUrl,
                name : fileName
            }); 
            return res.json({ msg: 'uploaded',file });
        } catch (err) {
            console.error(err);
            next(err); 
        }
    })
}