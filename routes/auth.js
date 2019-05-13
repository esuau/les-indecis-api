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

/* POST authentication request in queue. */
router.get('/', function(req, res, next) {
  var user = req.body.pseudo;
	var passwd = req.body.passwd;
	var ret = 'authentication_failure';
	var sql = "SELECT COUNT(*) AS nb FROM account WHERE username = '" + user + "' AND password = '" + passwd + "';";

	pool.query(sql, (err, r) => {
		if (err) {
      res.status(500).send('Error while reading notifications from DB : ' + err);
    } else {
			var token = helper.generateToken();
			ret = 'authentication_success:' + token;
			sql = "UPDATE account SET token_id = '" + token + "' WHERE username = '" + user + "' AND password = '" + passwd + "';";
			pool.query(sql, (err, r) => {
				if (err) console.log(err);
			});
		}
		res.send(ret);
	});
	return;
});

module.exports = router;
