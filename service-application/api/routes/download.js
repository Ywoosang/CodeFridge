const express = require('express'); 
const router = express.Router(); 
const downloadController = require('../controllers/download');
const { isLoggedIn,isTeamMember } = require('../middleware'); 
 
router.get('/file/preview',isLoggedIn,isTeamMember,downloadController.filePreview);
router.get('/file',isLoggedIn,isTeamMember,downloadController.fileDownload);
module.exports = router;
 