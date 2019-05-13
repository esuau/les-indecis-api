var express = require('express');
var router = express.Router();

/* GET heartbeat. */
router.get('/', function (req, res, next) {
  res.status(200).json({ code: 200, status: 'API SERVER VIP UP AND RUNNING' });
});

module.exports = router;
