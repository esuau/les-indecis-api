var express = require('express');
var router = express.Router();

var amqp = require('amqplib/callback_api');
var rabbit_host = 'amqp://rmqclient:undefined@rmq-vip/';
var queue_name = 'lost';

/* GET message in queue. */
router.get('/', function (req, res, next) {
  var ret = 'no_message';
  queue_name = req.query.queue;
  amqp.connect(rabbit_host, function (err, conn) {
    conn.createChannel(function (err, ch) {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue_name);
      ch.consume(queue_name, function (msg) {
        console.log(" [x] Received %s", msg.content.toString());
        ret = msg;
      },
      {
        noAck: true
      });
    });
    setTimeout(function () { conn.close(); res.send(ret) }, 500);
  });
  return;
});

module.exports = router;
