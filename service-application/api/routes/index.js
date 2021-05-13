var express = require('express');
var router = express.Router();
const path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
    try{
        if(req.user){
            res.redirect('/home')
        } else{
            res.redirect('/auth/login')
        }
        } catch(err){
            next(err); 
        }
});

router.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','/views','/home.html'));
}); 


module.exports = router;
