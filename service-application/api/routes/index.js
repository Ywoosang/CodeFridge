var express = require('express');
var router = express.Router();
const path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
    try{
        if(req.user){
            res.redirect('/team')
        } else{
            res.redirect('/auth/login')
        }
        } catch(err){
            next(err); 
        }
});

router.get('/error',(req,res,next)=>{
    const errorMsg = req.query.message;
    res.render('error',{errorMsg});
})

module.exports = router;
