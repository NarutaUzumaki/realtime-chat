
var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var Message = mongoose.model('Message',{
	name: String, 
	message: String}, 
	'realtime');

var dbURL = 'mongodb://localhost:27017/chat';

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) =>{
		res.send(messages);
	});
});



app.post('/messages', (req, res) => {
	var message = new Message(req.body);
	message.save((err) => {
		if(err)
			sendStatus(500);
		io.emit('message', req.body);
		res.sendStatus(200);
	})
});


//var dbURL = 'mongodb://username:pass@ds257981.mlab.com:57981/simple-chat';
// var MongoClient = require('mongodb').MongoClient;
// var mongoClient = new MongoClient("mongo://localhost:27017/",
// {useNewUrlParser: true});
// mongoClient.connect(function(err, client){
// 	if(err)
// })
io.on('connection', () => {
	console.log('a user is connected');
});


mongoose.connect(dbURL, (err) =>{
	console.log('mongodb connected', err);
});

var server = app.listen(3000, ()=>{
	console.log('server is running on port', server.address().port);
});





//var http = require('http').Server(app);


