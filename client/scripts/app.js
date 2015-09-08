
var app ={
  server: 'http://127.0.0.1:3000/classes/messages',
  roomList: {},
  friendList: {},

  init: function() {
    app.username = getUrlParameter('username');
    $('#myUsername').text(app.username);
    $('#send').submit(app.handleSubmit);
    $('#main').on('click', '.username', app.addFriend);
    $('#addRoom').click(app.createRoom);
    
    app.fetch();
    setInterval(app.fetch, 2000);
  },

  send: function(message) {
    app.startSpinner();
    $('#message').val('');

    $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
  },

  fetch: function() {
    $.ajax({
    url: app.server,
    type: 'GET',
    data: {order: '-createdAt'},
    contentType: 'application/json',
    success: function (data) {
      app.clearMessages();

      _.each(data.results, function(value) {
        app.addMessage(value);
      });

      app.stopSpinner();
    },

    error: function (data) {
      console.error('chatterbox: Failed to fetch message');
    }
    });
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  addMessage: function(message) {
    var selectedRoom = $("#roomSelect option:selected").val();
    if (!selectedRoom) {
      selectedRoom = 'lobby';
    }

    if (selectedRoom === message.roomname) {


      var $chat = $('<div class="chat"/>');
      var $username = $('<span class="username"/>');
      // append to the chat variable
      $username.text(message.username+': ').attr('data-username', message.username).attr('data-roomname',message.roomname).appendTo($chat);

      if (app.friendList[message.username]) {
         $username.addClass('friend');
      }

      var $message = $('<br><span/>');
      $message.text(message.text).appendTo($chat);

      // Add the message to the UI
      $('#chats').append($chat);
    }
    app.addRoom(message.roomname);
  },

  // called when a new room needs to be added to the drop down
  addRoom: function(room) {
    if (room !== undefined && room !== '') {
      if (app.roomList[room] === undefined) {
        var $roomToAppend = $('<option/>').val(room).text(room);
        $('#roomSelect').append($roomToAppend);
        app.roomList[room] = true;
      }
    }
  },

  // called when user clicks on the add room button
  createRoom: function(evt) {
    var roomname = _.escape($("#newRoom").val());
    app.addRoom(roomname);
    $('#roomSelect').val(roomname);
    $("#newRoom").val('');
  },

  addFriend: function(evt) {

    var username = $(evt.currentTarget).text();
    // strip off the colon and space chars
    username = username.substring(0, username.length-2);
    app.friendList[username] = true;

    // Escape the username in case it contains a quote
    var selector = '[data-username="'+username.replace(/"/g, '\\\"')+'"]';
    var $usernames = $(selector).addClass('friend');
  },

  handleSubmit: function(e) {
    e.preventDefault();

    username = _.escape(app.username);
    message = _.escape($('#message').val());
    room = _.escape($('#roomSelect').val());

    var messageObj = {
      username: username,
      text: message,
      roomname: room
    };

    app.send(messageObj);
  },
  
  startSpinner: function() {
    $('.spinner img').show();
  },

  stopSpinner: function() {
    $('.spinner img').hide();
  }
};

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
  }
}  

$( document ).ready(function() {
    app.init();
});