const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
var amqp = require('amqplib/callback_api');
var amqpConn = null ;

var rabbit_host = 'amqp://rmqclient:undefined@rmq-vip/' ;
var queue_name = 'lost' ;

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended:true}));
/*app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});*/

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/heartbeat.json')
});

app.post('/add_msg', (req, res) => {
	var m = req.body.msg ;
	queue_name = req.body.queue ;
	//console.log(req);
	amqp.connect(rabbit_host, function(err, conn) {
	  conn.createChannel(function(err, ch) {
		
		//ch.assertQueue(queue_name, {durable: true});
		ch.sendToQueue(queue_name, Buffer.from(m));
		console.log(" [x] Message sent %s", m);
	  });
	});
	res.send('add_message_success');
});

app.get('/get_msg', (req, res) => {
	var ret = "no_message";
	queue_name = req.query.queue ;
	amqp.connect(rabbit_host, function(err, conn) {
	conn.createChannel(function(err, ch) {
		//ch.assertQueue(queue_name, {durable: false});
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue_name);
		ch.consume(queue_name, function(msg) {
			console.log(" [x] Received %s", msg.content.toString());
			ret = msg ;
			res.send(ret);
		}, {noAck: true});
	});
		setTimeout(function() { conn.close(); }, 500);
	});
});

var listener = app.listen(process.env.PORT || 8080, function() {
 console.log('listening on port ' + listener.address().port);
});