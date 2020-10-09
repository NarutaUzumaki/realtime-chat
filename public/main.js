$(function(){
  var socket = io();

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
