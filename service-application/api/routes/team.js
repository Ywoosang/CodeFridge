const express = require('express'); 
const {isLoggedIn } = require('../middleware')
const router = express.Router(); 
 
const teamController = require('../controllers/team');

router.post('/',isLoggedIn,teamController.createTeam);
router.get('/:id',isLoggedIn,teamController.enterTeam);
router.get('/',isLoggedIn,teamController.mainPage); 

module.exports = router;
 