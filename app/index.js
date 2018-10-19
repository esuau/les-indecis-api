const express = require('express');
const morgan = require('morgan');
const app = express();
var amqp = require('amqplib/callback_api');
var amqpConn = null ;
var queue_name = 'test_name' ;
app.use(morgan('combined'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost/');
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
	amqp.connect('amqp://localhost', function(err, conn) {
	  conn.createChannel(function(err, ch) {

		ch.assertQueue(queue_name, {durable: false});
		ch.sendToQueue(queue_name, Buffer.from(m));
		console.log(" [x] Sent %s", m);
	  });
	  setTimeout(function() { conn.close(); process.exit(0) }, 500);
	});
});

app.get('/get_msg', (req, res) => {
	amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
		ch.assertQueue(queue_name, {durable: false});
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
		ch.consume(queue_name, function(msg) {
			console.log(" [x] Received %s", msg.content.toString());
			res.send(msg);
		}, {noAck: true});
	});
});
});

var listener = app.listen(process.env.PORT || 80, function() {
 console.log('listening on port ' + listener.address().port);
});