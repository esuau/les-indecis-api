var express = require('express');
var router = express.Router();

const helper = require('../util/helper');
const config = helper.readConfig('./conf/config.json');
const pg = require('pg');
const pool = new pg.Pool({
  user: config.psql.user,
  host: config.psql.host,
  database: config.psql.database,
  password: config.psql.password,
  port: config.psql.port
});

/* POST availability: check vehicle's availabiity. */
router.post('/', function (req, res, next) {
  let result = false;
  let accountId = req.body.userId;
  let commandId = req.body.commandId;
  if (accountId && commandId) {
    sql = "SELECT real_start_timestamp, real_end_timestamp FROM historic"
      + " WHERE account_id = " + accountId
      + " AND historic_id = " + commandId;
    pool.query(sql, (err, r) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
        return;
      } else if (r != null) {
        result = true;
      } else {
        result = false;
      }
      res.json({ available: result });
    });
  } else {
    res.status(400).json({ message: 'Bad request: accountId and commandId are required.' })
  }
  return;
});

module.exports = router;
