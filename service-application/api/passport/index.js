const passport = require('passport');
const { User } = require('../models');
//
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const github = require('./githubStrategy');
// 
module.exports = () => {
    passport.serializeUser((user,done) => {
        // 세션에 사용자 아이디 저장
        done(null,user.id); 
    });
    passport.deserializeUser((id,done) => {
        User.findOne({
            // serializeUser 에서 세션에 저장한 사용자 아이디
            where : { id }
        }).then(user => done(null,user))
        // 에러 확인 
        .catch(err => done(err)); 
    })
    local();
    kakao();
    github();
}
