var config = null ;
const crypto = require('crypto');
const reader = require('fs');
const { Client } = require('pg')
var client = null ;
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
	client = new Client({
		user: config.psql.user,
		host: config.psql.host,
		database: config.psql.database,
		password: config.psql.password,
		port: config.psql.port
	});
}

// Notification loop
exports.notifLoop = async function(admin) {
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
	admin.messaging().send("TEST FIREBASE")
	  .then((response) => {
		// Response is a message ID string.
		console.log('Successfully sent message:', response);
	  })
	  .catch((error) => {
		console.log('Error sending message:', error);
	  });
	module.exports.notifLoop()
}

exports.query = async function(sql) {
	var ret = null ;
	
	if(config == null) { config = module.exports.readConfig('config.json'); }
	if(pool == null) { module.exports.initDB(); }
	await client.connect()

	ret = await client.query('SELECT $1::text as message', ['Hello world!'])
	console.log(ret.rows[0].message) 
	await client.end()
	
	return ret ;
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