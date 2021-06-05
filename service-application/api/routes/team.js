const express = require('express'); 
const {isLoggedIn, isTeamMember } = require('../middleware')
const router = express.Router(); 
const { upload } = require('../index'); 
 
const teamController = require('../controllers/team');

router.post('/',isLoggedIn,teamController.createTeam);
router.get('/',isLoggedIn,teamController.mainPage);
router.post('/member',isLoggedIn,isTeamMember,teamController.enrollNewMember)
router.get('/manage',isLoggedIn,isTeamMember,teamController.manageTeam);
router.post('/manage/image',isLoggedIn,isTeamMember,upload.single('file'),teamController.changeTeamImage);
router.post('/manage/name',isLoggedIn,isTeamMember,teamController.changeTeamName);
router.get('/users',isLoggedIn,isTeamMember,teamController.getUsers);
router.get('/:id',isLoggedIn,teamController.enterTeam);

 
module.exports = router;
 