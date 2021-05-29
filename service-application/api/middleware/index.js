const { User,Team } = require('../models'); 

exports.isLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated()){
        return next();
    } res.redirect('/auth/login')
}

exports.isTeamMember = (req,res,next) => {
    if(req.session.teamId){
        return next(); 
    } 
    res.redirect('/team'); 
}