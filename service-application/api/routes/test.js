var express = require('express');
const { User } = require('../models');

const router = express.Router();
router.get('/',function (req, res, next) {
    User.create({
        email : 'opellong13@gmail.com',
        nickname : 'ywoosang',
        password : 'test123',
        provider : 'test'
    })
    .then(res=>{
        console.log(res);
    })
    .catch(err=>{
        console.log(err); 
    })
});

module.exports = router;
