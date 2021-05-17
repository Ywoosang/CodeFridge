const { File,Folder } = require('../models');

exports.getFolderContents = async (req,res,next)=>{
    const folderId = req.params.id;
    console.log('실행됌')
    try{
        const crrFolder = await Folder.findOne({
            where : {
                id:folderId 
            }
        })
        const files = await File.findAll({
            where : {
                folderId,
            }
        });
        const folders = await Folder.findAll({
            where :{
                hierarchy : crrFolder.hierarchy + 1,
                codeNumber : crrFolder.codeNumber,
            }
        })
        res.json({files,folders});
    }catch (err){
        console.log(err);
    }
}

exports.getAllContents = async (req,res,next)=>{
    if(!req.user){
        return res.json({expired:true});
    }
    const ownerId = req.user.id;
    try{
        const files = await File.findAll({
            where : {
                ownerId,
                folderId: null
            }
        });
        const folders = await Folder.findAll({
            where : {
                ownerId,
                hierarchy:1
            }
        });
        res.json({files,folders})
    }catch (err){
        console.log(err);
    }
}