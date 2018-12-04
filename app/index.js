const express = require('express');
const morgan = require('morgan');
const app = express();
var amqp = require('amqplib/callback_api');
var amqpConn = null ;

var rabbit_host = 'amqp://rmqclient:undefined@rmq-vip/' ;
var queue_name = 'test' ;

app.use(morgan('combined'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/heartbeat.json')
});

app.get('/add_msg', (req, res) => {
	var m = req.query.msg ;
	//queue_name = req.query.queue ;
	//res.set('Content-Type', 'text/html');
	//res.send(req);
	console.log(req);
	amqp.connect(rabbit_host, function(err, conn) {
	  conn.createChannel(function(err, ch) {
		
		ch.assertQueue(queue_name, {durable: true});
		ch.sendToQueue(queue_name, Buffer.from('test message'));
		console.log(" [x] Sent %s", m);
	  });
	  setTimeout(function() { conn.close(); process.exit(0) }, 500);
	});
	res.send('add_message_success');
});

app.get('/get_msg', (req, res) => {
	queue_name = req.query.queue ;
	amqp.connect(rabbit_host, function(err, conn) {
	conn.createChannel(function(err, ch) {
		ch.assertQueue(queue_name, {durable: false});
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
		ch.consume(queue_name, function(msg) {
			console.log(" [x] Received %s", msg.content.toString());
			res.send("Retrieved message : " + msg);
		}, {noAck: true});
	});
});
});

var listener = app.listen(process.env.PORT || 8080, function() {
 console.log('listening on port ' + listener.address().port);
});