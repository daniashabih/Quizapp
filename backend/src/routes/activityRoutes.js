const express = require('express');
const router = express.Router();
const { heartbeat, getActiveNow } = require('../controllers/activityController');

router.post('/heartbeat', heartbeat);
router.get('/active-now', getActiveNow);

module.exports = router;
