const express = require('express');
const { route } = require('.');
const router = express.Router();
const { File,Folder } = require('../models');

router.post('/all',async (req,res,next)=>{
    if(!req.user){
        return res.json({expired:true});
    }
    const ownerId = req.user.id;
    try{
        const files = await File.findAll({
            where : {
                ownerId
        }});
        const folders = await Folder.findAll({
            where : {
                ownerId
            }
        });
        console.log(files,folders); 
        res.json({files,folders})
    }catch (err){
        console.log(err);
    }
});



module.exports = router;