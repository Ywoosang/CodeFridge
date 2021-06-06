const { User,Team } = require('../models');
const {sequelize } = require('../models'); 
const {QueryTypes} = require('sequelize')

exports.isLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated()){
        return next();
    } res.redirect('/auth/login')
}

exports.isTeamMember = async(req,res,next) => {
    const teamId = req.session.teamId
    if(teamId){
        try{
            const team = await Team.findByPk(teamId);
            const teamName = team.name;
            let size = await sequelize.query(`
            SELECT SUM(size) from files WHERE teamId=${teamId}`
            ,{
                type: QueryTypes.SELECT,
            }); 
            size = parseInt(size[0]["SUM(size)"])/(1024*1024);
            size = size.toFixed(3); 
            req.data = {
                teamName,
                size
            }
        }catch(err){
            next(err);
        }
        return next(); 
    } 
    res.redirect('/team'); 
}

