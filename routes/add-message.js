var express = require('express');
var router = express.Router();

var amqp = require('amqplib/callback_api');
var rabbit_host = 'amqp://rmqclient:undefined@rmq-vip/';
var queue_name = 'lost';

/* POST message in queue. */
router.post('/', function (req, res, next) {
  var m = req.body.msg;
  queue_name = req.body.queue;
  amqp.connect(rabbit_host, function (err, conn) {
    conn.createChannel(function (err, ch) {
      ch.sendToQueue(queue_name, Buffer.from(m));
      console.log(" [x] Message sent %s", m);
    });
  });
  res.send('add_message_success');
  return;
});

module.exports = router;
