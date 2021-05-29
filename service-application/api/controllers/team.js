const { User,Team } = require('../models/'); 

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
        team.addUser(user);
        const result = await User.findOne({
            where : { id:req.user.id},
            include: Team
        })
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


