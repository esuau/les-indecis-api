var config = null ;
const crypto = require('crypto');
const reader = require('fs');
const pg = require('pg');
var pool = null ;
var clients = [] ;

// Generate unique token
exports.generateToken = function() {
	var token = crypto.randomBytes(32).toString('hex') ;
	while(clients.indexOf(token) != -1) token = crypto.randomBytes(32).toString('hex') ;
	return token ;
}

// Init database
exports.initDB = function () {
	if(config == null) 
	{
		config = module.exports.readConfig("config.json");
	}
	pool = new pg.Pool({
		user: config.psql.user,
		host: config.psql.host,
		database: config.psql.database,
		password: config.psql.password,
		port: config.psql.port
	});
}

// Notification loop
exports.notifLoop = async function() {
	if(config == null) 
	{
		config = module.exports.readConfig("config.json");
	}
	await module.exports.sleep(config.notif.interval);
	console.log("Waiting for notifications");
	clients.forEach(function(el) {
		console.log("Sending notification test to client");
		el.connection.sendUTF("notif:TEST NOTIFICATION");
	});
	module.exports.notifLoop()
}

exports.query = async function(sql) {
	var ret = null ;
	
	if(config == null) { config = module.exports.readConfig('config.json'); }
	if(pool == null) { module.exports.initDB(); }
	
	await pool.query(sql, (err, r) => {
		if(err) console.log(err);
		else return r ;
	});
}

// Read configuration file
exports.readConfig = function (conf_file) {
	let raw = reader.readFileSync(conf_file);
	config = JSON.parse(raw);
	return config;
}

// Saving client
exports.saveClient = function (c) {
	clients.push(c);
}

// Sleep for specified amount of time
exports.sleep = function (ms) {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}