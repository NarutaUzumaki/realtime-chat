const express = require("express");
const socket = require("socket.io");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
 
const PORT = 3000;
const app = express();


app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});


const io = socket(server);

io.on('connection', socket => {
	console.log('a new user is connected');

	//simple greatings 
	io.emit('test', 'Welcome to Arcadium chat');
	//simple inform about connect and disconnect other user
	socket.broadcast.emit('user', 'New user has joined to Arcadium');
	//simple inform about disconnect
	socket.on('disconnect', () => {
		io.emit('test', 'A user has left the chat');
	})
	//listen to user typing and inform other about it
	socket.on('typing', (data)=>{
		if(data.typing==true)
			socket.broadcast.emit('display', data)
		else
			socket.broadcast.emit('display', data)
	})
});

//------------------------------

const Message = mongoose.model('Message',{
	name: String, 
	message: String
}, 'realtime');

mongoose.connect('mongodb://localhost:27017/chat', function(error){
	if( error ) {
		return console.log('Error MongoDB', error);
	}
	console.log('MongoDB connected');
});

//------------------------------

app.get('/messages', showMessage);
app.post('/messages', createMessage);

function showMessage(req, res) {
  Message.find({}, (err, messages) =>{
		res.json(messages);
	});
}

function createMessage(req, res) {

  const message = new Message(req.body);
  
  message.save((err) => {
    
    if(err) {
			return sendStatus(500);
    }

		io.emit('message', req.body);
    
    return res.sendStatus(200);
  })

}