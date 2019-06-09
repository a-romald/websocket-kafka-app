var http = require('http');
var Static = require('node-static');
const kafka = require('kafka-node');
const WebSocketServer = new require('ws');

const kafka_server = 'localhost:2181'
const kafka_topic = 'news'

const client = new kafka.KafkaClient(kafka_server);
let consumer = new kafka.Consumer(
  client,
  [{ topic: kafka_topic, partition: 0 }],
  {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'utf8',
    fromOffset: false
  }
);

const producer = new kafka.Producer(client);


// connected clients
let clients = {};

// WebSocket-server on port 8081
const webSocketServer = new WebSocketServer.Server({
  port: 8081
});


webSocketServer.on('connection', function(ws, req) {

  let user_id = req.url.replace('/?token=', '')
  console.log('User_id: ' + user_id);
  clients[user_id] = ws;

  console.log("new connection " + user_id);

  ws.on('message', function(message) {
    console.log('message from form: ' + message);

    let payloads = [
      {
        topic: kafka_topic,
        messages: message
      }
    ];

    let push_status = producer.send(payloads, (err, data) => {
      if (err) {
        console.log('[kafka-producer -> '+kafka_topic+']: broker update failed');
      } else {
        console.log('[kafka-producer -> '+kafka_topic+']: broker update success');
      }
    });
    
  });

  consumer.on('message', async function(message) {
    console.log( 'kafka-> ', message.value );
    
    let val = JSON.parse(message.value);
    key = user_id;
    if (key in clients) {
      if (key == val.user_id) {
        clients[key].send(message.value);
      }
    }    

    //ws.send(message.value);

  });


  consumer.on('error', function(err) {
    console.log('error', err);
  });

  ws.on('close', function() {
    console.log('connection closed ' + user_id);
    delete clients[user_id];
  });

});



// Basic http-server (static) on port 8080
var fileServer = new Static.Server('.');
http.createServer(function (req, res) {
  
  fileServer.serve(req, res);

}).listen(8080);

console.log("Server is running on ports 8080, 8081");