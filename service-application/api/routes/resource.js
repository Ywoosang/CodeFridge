const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource');

router.post('/all',resourceController.getAllContents);
router.post('/folder/:id',resourceController.getFolderContents);

module.exports = router;