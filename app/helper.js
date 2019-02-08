const crypto = require('crypto');
const reader = require('fs');
var config = null ;
var clients = [] ;

// Generate unique token
exports.generateToken = function() {
	var token = crypto.randomBytes(32).toString('hex') ;
	while(clients.indexOf(token) != -1) token = crypto.randomBytes(32).toString('hex') ;
	return token ;
}

// Read configuration file
exports.readConfig = function (conf_file) {
	let raw = reader.readFileSync(conf_file);
	config = JSON.parse(raw);
	return config;
}

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

exports.saveClient = function (c) {
	clients.push(c);
}

exports.sleep = function (ms) {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}