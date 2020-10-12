var socket = io();
var typing=false;
var timeout=undefined;

$(document).ready(function(){
  $('#message').keypress((e)=>{
    if(e.which!=13){
      typing=true
      socket.emit('typing', {typing:true})
      clearTimeout(timeout)
      timeout=setTimeout(typingTimeout, 1000)
    }else{
      clearTimeout(timeout)
      typingTimeout()

    }
  })

  function typingTimeout(){
    typing=false
    socket.emit('typing', {typing:false})
  }

  socket.on('display', (data)=>{
    if(data.typing==true){
      $('.typing').text(`User is typing...`)
    }
    else
      $('.typing').text("")
  })
})

$(function(){

  $("#send").click(function(){
    
    sendMessage({
      name: $("#name").val(),
      message: $("#message").val()
    });
  })

  //catch simple functions from server and show it to console
  socket.on('test', greatings => {
    console.log(greatings);
  });

  socket.on('user', user => {
    console.log(user);
  });
  //--
  socket.on('message', getMessages);

  function addMessages(message) {
    $("#messages").prepend(`<h4> ${message.name} </h4> <p> ${message.message} </p>`)
  }

  function getMessages() {
    $.get('/messages', (data) => {
      console.log(data);
      data.forEach(addMessages);
    })
  }

  function sendMessage(message) {
    $.post('/messages', message)
  }

});
