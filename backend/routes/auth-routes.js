const express = require('express');
const router = express.Router();

const login = require('../auth/login');

router.post('/admin', login.adminLogin)
router.post('/student', login.studentLogin)

module.exports = router;
