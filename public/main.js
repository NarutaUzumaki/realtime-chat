$(function(){
  var socket = io();

  $("#send").click(function(){
    
    sendMessage({
      name: $("#name").val(),
      message: $("#message").val()
    });
  })

  socket.on('message', addMessages);

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
