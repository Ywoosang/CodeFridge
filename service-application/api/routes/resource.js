const express = require('express');
const { isLoggedIn, isTeamMember } = require('../middleware')
const router = express.Router();
const resourceController = require('../controllers/resource');

router.post('/',isLoggedIn,isTeamMember,resourceController.getSearchContents);
router.get('/all',isLoggedIn,isTeamMember,resourceController.getAllContents);
router.get('/folder',isLoggedIn,isTeamMember,resourceController.getFolderContents);
router.get('/test',resourceController.getTestData);
router.get('/favorites',isLoggedIn,isTeamMember,resourceController.getFavoriteContents);
router.post('/file/favorite',isLoggedIn,isTeamMember,resourceController.toggleStar);
router.delete('/',isLoggedIn,isTeamMember,resourceController.deleteContent);
router.get('/trash',isLoggedIn,isTeamMember,resourceController.getTrashContents);
// 
router.get('/file/:id',isLoggedIn,isTeamMember,resourceController.getFilePage);
router.post('/file/:id',isLoggedIn,isTeamMember,resourceController.getNewFilePage)
router.post('/file',isLoggedIn,isTeamMember,resourceController.restoreFile);

module.exports = router;