const path = require('path');
const { File,Folder,Code } = require('../models'); 
const { upload } = require('../index')
 
const s3Upload = upload.single('file'); 
 

// controller
exports.fileUpload = async(req , res , next ) => {
    s3Upload(req, res, async (err) => {
        try {
            if(err){
                console.log(err); 
            }
            if(!req.user.id){
                return res.json({msg:'expired'});
            } 
            // 업로드된 파일  
            const f = req.file; 
            // aws 에 업로드된 파일 주소 
            const key = req.data;
            console.log('업로드된 키',key)
            const fileUrl = f.location; 
            // 팀 아이디
            const teamId = req.session.teamId;
            // 소유자 아이디
            const ownerId = req.user.id; 
            // 파일 정보
            const size = f.size;
            const fileName = path.basename(f.originalname);   
            const filePath = f.originalname.split('/');
            const codeNumber =  req.body.num.substr(0,9);
            const pathLength = filePath.length; 
            const hierarchy = filePath.length-1; 
            const mimetype = req.file.mimetype;
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
                        ownerId,
                        name: fd,
                        hierarchy : idx,
                        codeNumber,
                        teamId 
                    }
                })
                // 해당 폴더가 존재하지 않으면 
                if(!tmp){
                    await Folder.create({
                        ownerId,
                        name: fd,
                        hierarchy: idx,
                        codeNumber,
                        teamId,
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
                    awsKey : key,
                    teamId,
                    mimetype,
                    size,
                }); 
                return res.json({ msg: 'uploaded',file });
            };
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
                name : fileName,
                awsKey:key,
                teamId,
                mimetype,
                size,
            }); 
            return res.json({ msg: 'uploaded',file });
        } catch (err) {
            console.error(err);
            next(err); 
        }
    })
}