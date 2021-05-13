const express = require('express');
const router = express.Router();
const passport = require('passport')
const path = require('path')
const bcrypt = require('bcrypt');
const { User }= require('../models')
// 로컬 로그인
router.route('/signup')
    .get((req, res) => {
        return  res.sendFile(path.join(__dirname,'../views/signup.html'))  
    })
    .post(async (req, res, next) => {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        try {
            // 기존에 가입된 사용자가 있는지 확인
            const user = await User.findOne({ where: { email } })
            console.log(user);
            if (user) {
                return res.redirect(`/auth/signup?signupError=${'이미 존재하는회원입니다'}`);
            }
            const hash = await bcrypt.hash(password, 12);
            await User.create({
                nickname:name,
                email,
                password: hash
            })
            res.redirect('/auth/login');
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

router.route('/login')
    .get((req, res) => {
        return  res.sendFile(path.join(__dirname,'../views/login.html'))  
    })
    .post((req, res, next) => {
        passport.authenticate('local', (authError, user, info) => {
            if (authError) {
                console.error(authError);
                return next(authError);
            }
            if (!user) {
                return res.redirect(`login?loginError=${info.message}`);
            }
            return req.login(user, (loginError) => {
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }
                return res.redirect('/');
            });
        })(req, res, next)
    });

// 깃허브 로그인
router.get('/github', passport.authenticate('github'));
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function (req, res) {
        console.log('로그인됨');
        res.redirect('/');
    });

// 카카오 로그인
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', 
    passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

// 로그아웃
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy(()=>{
       req.session; 
    });
    res.redirect('/')
});

module.exports = router;