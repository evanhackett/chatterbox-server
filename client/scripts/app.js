// YOUR CODE HERE:
var app = {
  server : 'http://127.0.0.1:3000/classes/messages',
  rooms : {},
  currentRoom: undefined,
  recentFetch : {},
  friends : {}
};

app.handleSubmit = function() {
  var newMessage = {
    username: window.location.search.slice(10),
    text: $('#message').val(),
    roomname: $('#room').val()
  };
  app.send(JSON.stringify(newMessage));
  //app.send(newMessage);
};



app.init = function() {
  app.fetch();
};

app.send = function(message) {
  $.ajax({
    // always use this url
    url: 'http://127.0.0.1:3000/classes/messages',
    type: 'POST',
    data: message,
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      console.log('Getting messages...');
      $('#message').val("");
    },
    error: function (data, desc) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
      console.error(desc);
      console.error(data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: 'http://127.0.0.1:3000/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      app.recentFetch = data;
      app.parseResults(data);
      console.log("Yay it worked!");
      setTimeout(app.fetch, 20000);
    },
    error: function(data) {
      console.log('Something bad happened...');
      setTimeout(app.fetch, 20000);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  var element = $('<div>');
  var $un = $('<span class="username">').text(message.username).on('click', app.addFriend);
  if ($un.text() in app.friends) {
    $un.addClass('friend');
  }
  element.append($un);
  element.append(" | ");
  element.append($('<span class="message">').text(message.text));
  $('#chats').append(element);
};

app.addRoom = function(room) {
  var element = $('<div class="room">');
  element.text('•' + room).on('click', app.changeRoom);
  $('#roomSelect').append(element);
};

app.parseResults = function(data) {

  app.rooms = {};
  for (var i = 0; i < data.results.length; i++) {
    var roomName = data.results[i].roomname;
    if (app.rooms[roomName] === undefined) {
      app.rooms[roomName] = [];
    }
    app.rooms[roomName].push(data.results[i]);
  }
  $('#roomSelect').empty();
  var roomNames = Object.keys(app.rooms);
  for(i = 0; i < roomNames.length; i++) {
    app.addRoom(roomNames[i]);
  }
  if (app.currentRoom !== undefined) {
    app.changeRoom("", app.currentRoom);
  }
};

app.addFriend = function(event) {
  var $el = $(this);
  var username = $el.text();
  if(username in app.friends) {
    alert('already friended!');
  } else {
    app.friends[username] = true;
  }
};

app.changeRoom = function(event, nonEvent) {
  //change the room!
  var roomName;
  app.clearMessages();
  if (nonEvent === undefined) {
    roomName = $(this).text().slice(1);
  }
  else {
    roomName = nonEvent;
  }
  app.currentRoom = roomName;
  for (var i = 0; i < app.rooms[roomName].length; i++) {
    app.addMessage(app.rooms[roomName][i]);
  }
};

app.init();
  // var message = {
  //     'username': 'shawndrost',
  //     'text': 'trololo',
  //     'roomname': '4chan'
  //   };
