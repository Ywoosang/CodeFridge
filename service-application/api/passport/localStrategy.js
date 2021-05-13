const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models'); 

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email 
        passwordField : 'password', // req.body.password 
    }, async (email,password,done)=>{ // 위 email,password 와 변수명이 같아야함
        try {
            const user = await User.findOne({ where : {email} });
            console.log(user);
            if(user && user.password) {
                console.log(password,user.password);
                // 해싱한 값끼리 비교
                const result = await bcrypt.compare(password,user.password);  
                if(result) {
                    done(null,user);
                }else {
                    done(null,false,{ message : '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null,false,{ message : '존재하지 않는 회원입니다.'});
            }
        } catch(error){
            console.error(error);
            done(error); 
        }
    }));
}
