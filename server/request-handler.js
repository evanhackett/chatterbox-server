var utils = require('./utils');

// later will implement a database. For now all messages are stored in this messages object
messages = {"results": [
  {"username": "Jono",
   "text": "Do my bidding!",
   "roomname": "room1"},

  {"username":"asdf",
   "text":"4chan",
   "roomname":"4chan"}
]};

var requestMethods = {
  'OPTIONS': function(req, res) {
    utils.sendResponse(res, null);
  },

  'GET': function(req, res) {
    utils.sendResponse(res, messages);
  },

  'POST': function(req, res) {
    utils.collectData(req, function(message) {
      messages.results.push(message);
      utils.sendResponse(res, null, 201);
    });
  }
};

module.exports = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var action = requestMethods[request.method];
  if (action) {
    action(request, response);
  } else {
    // handle error if no action
    utils.sendResponse(response, "Not Found", 404);
  }
};

