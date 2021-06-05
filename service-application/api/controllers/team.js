const { User,Team, sequelize } = require('../models/'); 
const { QueryTypes } = require('sequelize');

exports.mainPage = async(req,res,next) =>{
    const teams = await Team.findAll({
        include:[
            { model: User, where: { id: req.user.id}} 
        ] 
    });
    for(team of teams){
        console.log(team.id);
        const users = await User.findAll({
            include : [
                { model: Team, where : { id : team.id }}
            ]
        })
        team.users = users; 
    }
    res.render('team',{teams});
}

exports.createTeam = async(req,res,next) =>{
    const name  = req.body.name.toString();
    if(name.length>10){
        res.json({error: '팀 이름이 너무 깁니다'})
    }
    if(name){
        const team = await Team.create({
            name : name
        });
        const user = await User.findOne({
            where : {
                id :req.user.id,
            }
        });
        team.addUser(user,{
            through: { 
                rank : 'manager'
            }
        });
        
    } else {
        res.json({error :404})
    }
    res.redirect('/team');
}

exports.enterTeam = (req,res,next) =>{
    const sess = req.session;
    sess.teamId = req.params.id;
    if(!sess || !sess.teamId){
        return res.redirect('/error?message="올바르지 못한 접근입니다."')
    }
    res.redirect('/resource/all');
}

exports.getUsers = async(req,res,next) =>{
    const teamId = req.session.teamId;
    const nickId = req.query.nickId;
    const userId = req.query.userId; 
    console.log(teamId);
    if(!nickId)  return res.redirect('/error?message="팀원 아이디를 입력해주세요"')
    try{
//  HAVING not exist (SELECT TMP.UserId FROM user_team TMP WHERE TMP.TeamId=${teamId} and TMP.UserId=${userId}) ;
        const users = await sequelize.query(`
        SELECT  U.nickname,U.id,UT.UserId,U.nickId 
        FROM user_team UT 
        RIGHT OUTER JOIN users U 
        ON U.id = UT.UserId 
        WHERE U.nickId like "%${nickId}%" 
        GROUP BY U.nickname,U.id,UT.UserId,U.nickId 
        `,{
            type: QueryTypes.SELECT
        }); 
        res.json({users}); 
    }catch(err){
        next(err); 
    }
}

exports.manageTeam = async(req,res,next) => {
    const teamId = req.session.teamId;
    try{
    const team = await Team.findByPk(teamId); 
    const members = await sequelize.query(`
    SELECT U.nickname,U.nickId,UT.rank,T.name,T.id 
    FROM users U 
    LEFT JOIN user_team UT ON U.id = UT.UserId 
    LEFT JOIN teams T ON UT.TeamId = T.id 
    WHERE T.id =${teamId} AND UT.rank IS NOT NULL;
    `,{ type: QueryTypes.SELECT });
    res.render('manage',{ members,team }); 
    }catch(err){
        next(err); 
    }   
}

//
exports.changeTeamImage = async(req,res,next) => {
    const teamId = req.session.teamId;
    const img = req.file.location;
    try{
        
    if(!img) return res.redirect('/error?message="이미지 파일을 업로드하세요"')
    await Team.update({
        img,
        updatedAt : new Date(),
    },{
        where : {
            id : teamId
        }
    }); 
    res.redirect('/team/manage')
    }catch(err){
        next(err); 
    }   
}

exports.changeTeamName = async(req,res,next) => {
    const teamId = req.session.teamId;
    const name = req.body.teamName;
    try{
    if(!name) return res.redirect('/error?message="팀 이름을 입력하세요"'); 
    if(name.length> 15) return res.redirect('/error?message="팀 이름은 10 자 이내여야 합니다."'); 
    await Team.update({
        name,
        updatedAt : new Date(),
    },{
        where : {
            id : teamId
        }
    }); 
    res.redirect('/team/manage')
    }catch(err){
        next(err); 
    }   
}


exports.enrollNewMember =  async(req,res,next) => {
    const rank = req.body.rank;
    const memberId = req.body.userId; 
    if(!memberId || !rank) return res.status(400).end(); 
    try{
        const isTeamMember = await sequelize.query(`
        SELECT UserId 
        FROM user_team 
        WHERE TeamId =${req.session.teamId} AND UserId=${memberId};
        `,{type : QueryTypes.SELECT});
        console.log(isTeamMember !== [] && isTeamMember.length >0);
        if(isTeamMember !==[] && isTeamMember.length >0) return res.json({
            message : `이미 멤버입니다.`,
        })
        const team = await Team.findOne({
            id : req.session.teamId 
        });
        const user = await User.findOne({
            where : {
                id :memberId
            }
        });
        team.addUser(user,{
            through: { 
                rank 
            }
        });
        const auth = rank == 'manager' ? '관리자' : '노예'; 
        return res.json({
            message : `${user.nickname} 님을 ${auth}로 초대했습니다.`,
        })
    }catch(err){
        next(err);
    }
}