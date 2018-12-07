// Const and variables init
const crypto = require('crypto');
const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const pg = require('pg');
const pool = new pg.Pool({
user: 'postgres',
host: 'bdd-vip.undefined.inside.esiag.info',
database: 'pds',
password: 'undefined',
port: '5432'});
var amqp = require('amqplib/callback_api');
var amqpConn = null ;
var rabbit_host = 'amqp://rmqclient:undefined@rmq-vip/' ;
var queue_name = 'lost' ;
var clients = [] ;
var count = 0 ;

// App init
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended:true}));

// Root heartbeat
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/heartbeat.json')
});

// POST /add_msg in queue
app.post('/add_msg', (req, res) => {
	var m = req.body.msg ;
	queue_name = req.body.queue ;
	amqp.connect(rabbit_host, function(err, conn) {
	  conn.createChannel(function(err, ch) {
		ch.sendToQueue(queue_name, Buffer.from(m));
		console.log(" [x] Message sent %s", m);
	  });
	});
	res.send('add_message_success');
	return ;
});

// GET /get_msg in queue
app.get('/get_msg', (req, res) => {
	var ret = "no_message";
	queue_name = req.query.queue ;
	amqp.connect(rabbit_host, function(err, conn) {
	conn.createChannel(function(err, ch) {
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue_name);
		ch.consume(queue_name, function(msg) {
			console.log(" [x] Received %s", msg.content.toString());
			ret = msg ;
		}, {noAck: true});
	});
		setTimeout(function() { conn.close(); res.send(ret)}, 500);
	});
	return ;
});

// POST /add_msg in queue
app.post('/connect', (req, res) => {
	var user = req.body.pseudo ;
	var passwd = req.body.passwd ;
	var ret = "authentication_failure" ;
	var token = "" ;
	var sql = "SELECT COUNT(*) AS nb FROM account WHERE username = '" + user + "' AND password = '" + passwd + "';" ;

	pool.query(sql, (err, r) => {
		if(err) {res.send("Error while reading notifications from DB : " + err); }
		else 
		{
			if(r.rows[0].nb != 0)
			{
				token = crypto.randomBytes(48).toString('hex') ;
				ret = "authentication_success:" + token ;
			}
		}
	});
	return ;
});

// HTTP listen point
var listener = app.listen(process.env.PORT || 8080, function() {
	console.log('listening on port ' + listener.address().port);
});