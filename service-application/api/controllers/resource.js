const { File, Folder,Comment } = require('../models');
const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models')
exports.getFolderContents = async (req, res, next) => {
    const folderId = req.query.id;
    try {
        const crrFolder = await Folder.findOne({
            where: {
                id: folderId
            }
        });
        const files = await File.findAll({
            where: {
                folderId,
            }
        });
        const folders = await Folder.findAll({
            where: {
                hierarchy: crrFolder.hierarchy + 1,
                codeNumber: crrFolder.codeNumber,
            }
        })
        res.render('home', { folders, files });
    } catch (err) {
        console.log(err);
    }
}
exports.getTestData = (req, res, next) => {
    const sess = req.session;
    const team = req.session.teamId;
    res.json({ sess,team });
}

exports.getAllContents = async (req, res, next) => {
    try {
        const files = await File.findAll({
            where: {
                teamId : req.session.teamId,
                folderId: null
            }
        });
        //  객체 (오브젝트) 형식
        const folders = await Folder.findAll({
            where: {
                teamId : req.session.teamId,
                hierarchy: 1
            }
        });
        res.render('home', { files, folders });
    } catch (err) {
        console.log(err);
    }
}

exports.getFavoriteContents = async (req, res, next) => {
    try {
        const teamId = req.session.teamId;
        const files = await File.findAll({
            where: {
                teamId,
                favorite: 1
            }
        });
        res.render('home', { files })
    } catch (err) {
        next(err);
    }
}

exports.toggleStar = async (req, res, next) => {
    const id = parseInt(req.query.id);
    const point = parseInt(req.body.point);
    if (point == undefined) {
        return res.status(501).end();
    }
    try {
        await File.update({ favorite: point }, {
            where: {
                id
            }
        })
        res.end();
    } catch (err) {
        next(err);
    }
}

exports.getSearchContents = async (req, res, next) => {
    try {
        const searchWord = req.query.name.trim();
        // 개수 제한
        const teamId = req.session.teamId;
        const limit = req.query.limit;
        if (Number.isNaN(limit)) {
            // 400 (잘못된 요청) 
            res.status(400).end();
        } 
        const files = await File.findAll({
            where: {
                teamId,
                folderId: null,
                name: {
                    [Op.like]: "%" + searchWord + "%"
                },
            }
        });
        let folders = await Folder.findAll({
            where: {
                name: {
                    [Op.like]: "%" + searchWord + "%"
                },
                teamId 
            },
        });
        res.json({ files, folders })
    } catch (err) {
        next(err)
    }
}

exports.deleteContent = async (req, res, next) => {
    try {
        const id = req.query.id;
        const _class = req.query.class;
        const now = Date.now();
        if (!id || !_class) return res.status(404).end();
        if (_class == 'folder') {
            sequelize.query(`
            UPDATE files a,folders b 
            SET a.deletedAt=NOW(),b.deletedAt=NOW() 
            WHERE a.folderId = b.id and b.id=${id}
            `, { type: QueryTypes.UPDATE })
                .then(() => {
                    res.end();
                })
                .then(() => {
                    res.end();
                }
                )
        } else {
            File.destroy({
                where: {
                    id
                }
            })
                .then(() => {
                    res.end();
                })
        }
    } catch (err) {
        next(err);
    }
}

exports.getTrashContents = async (req, res, next) => {
    try {
        if (!req.user.id) return res.status(403).end();
        console.log(req.user.id);
        const teamId = req.session.teamId;
        
        const files = await File.findAll({
            where: {
                teamId,
                deletedAt: { [Op.ne]: null },
            },
            paranoid: false
        })
        const folders = await Folder.findAll({
            where: {
                teamId,
                deletedAt: { [Op.ne]: null },
            },
            paranoid: false
        })
        const deleteCategory = true;
        res.render('home', { folders, files, deleteCategory })
    } catch (err) {
        next(err);
    }
}

// 파일 복구 
exports.restoreFile = (req, res, next) => {
    console.log(req.query.id);
    // 파일 아이디
    const id = parseInt(req.query.id);
    // 상위 폴더 여부 
    const hasParentFolder = parseInt(req.query.parent);
    // 클라이언트 전송 오류일 경우
    if (!id) return res.redirect('error',{message:'올바른 파일인지 확인하세요.'});
    if(hasParentFolder){
        sequelize.query(`
        UPDATE files a,folders b 
        SET a.deletedAt=NULL,b.deletedAt=NULL 
        WHERE a.folderId = b.id and a.id=${id}
        `, { type: QueryTypes.UPDATE })
            .then(() => {
                res.end();
            })
    } else {
        File.update({
            deletedAt : null
        },{
            where :{
                id 
            },
            paranoid: false
        })
    }
    res.end();
    // 조인 후 업데이트
}

exports.getFilePage = async(req,res,next) =>{
    // 파일 아이디
    const id = parseInt(req.params.id);
    if(!Number.isInteger(parseInt(id)))  return res.status(400).end();
    try {
    const file = await File.findOne({
        where : {
            id
        }
    }); 
    let pdf=false;
    if(file.name.includes('pdf')){
        pdf=true
    }
    // 댓글 단 사용자 정보 가져오기 위해 조인 
    const comments = await sequelize.query(`
    SELECT usr.nickname,com.createdAt,com.content 
    FROM comments com  
    JOIN users usr ON usr.id = com.ownerId 
    WHERE com.fileId =${id};
    `,{type: QueryTypes.SELECT})
    // 댓글 렌더링 
    res.render('file',{file,pdf,comments});
}catch(err){
    next(err);
}
}

exports.getNewFilePage = async(req,res,next) => {
    const id = req.params.id;
    const content = req.body.editordata;
    try{
        if(!content){
            return res.status(400).end();  
        }
        await Comment.create({
            content,
            ownerId: req.user.id,
            fileId : id,
        })
        res.redirect(`/resource/file/${id}`)
    }catch(err){
        next(err);
    } 
}