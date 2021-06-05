const express = require('express');
const router = express.Router();
const passport = require('passport')
const path = require('path')
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { Op } = require('sequelize');
// 로컬 로그인
router.route('/signup')
    .get((req, res) => {
        return res.sendFile(path.join(__dirname, '../views/signup.html'))
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
                nickname: name,
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
        return res.sendFile(path.join(__dirname, '../views/login.html'))
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

router.route('/profile')
    .get(async (req, res, next) => {
        try {
            const id = req.user.id;
            const user = await User.findOne({
                where: {
                    id
                }
            })
            res.render('profile', { user });
        } catch (err) {
            next(err);
        }

    })
router.post('/profile/id', async(req,res,next) => {
    try{
    const id = req.user.id;
    const nickId = req.body.nickId;
    if(!nickId) return res.redirect('/error?message="값을 입력해주세요"'); 
    if (nickId.length > 10) {
        // 에러처리 할것
        return res.redirect('/error?message="아이디 값이 너무 깁니다"');
    }
    const pattern = /^[A-Za-z0-9+]*$/;
    if (!pattern.test(nickId)) {
        return res.redirect('/error?message="아이디는 영문과 숫자로 이루어져 있어야 합니다."');
    }
    const isnickId = await User.findOne({
        where: {
            nickId,
            id: {
                [Op.ne]: id
            }
        }
    })
    if (isnickId) {
        return res.redirect('/error?message="이미 존재하는 아이디 입니다."');
    }
    await User.update({
        nickId,
        updatedAt: new Date(),
    }, {
        where: {
            id
        }
    });
    res.redirect('/auth/profile');
} catch (err) {
    next(err);
}
})
router.post('/profile/name', async(req,res,next) => {

    try {
        const id = req.user.id;
        const nickname = req.body.name;
        if (nickname.length > 10) {
            // 에러처리 할것
            return res.redirect('/error?message="이름 값이 너무 깁니다"');
        }
        await User.update({
            nickname,
            updatedAt: new Date(),
        }, {
            where: {
                id
            }
        });
        res.redirect('/auth/profile');
    } catch (err) {
        next(err);
    }
})
const { upload } = require('../index'); 

router.post('/profile/image', upload.single('file'),async (req, res, next) => {
    try {
        const id = req.user.id;
        const img = req.file.location;
        if (!img) {
            return res.redirect('/error?message="올바르지 않은 이미지입니다."');
        }
        await User.update({
            img,
            updatedAt: new Date(),
        }, {
            where: {
                id
            }
        });
        res.redirect('/auth/profile');
    } catch (err) {
        next(err);
    }
})

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
    req.session.destroy(() => {
        req.session;
    });
    res.redirect('/');
});

module.exports = router;