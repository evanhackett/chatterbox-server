var fs = require('fs');
var fileContents;
fs.readFile('./messages.json', 'utf8', function(err, data) {
  fileContents = data; 
});

messages = {"results": [
  {"username": "Jono",
   "text": "Do my bidding!",
   "roomname": "room1"},

  {"username":"asdf",
   "text":"4chan",
   "roomname":"4chan"}
]};

var requestHandler = function(request, response) {
  this.messages = messages || JSON.parse(fileContents);


  // {'results' : [{
  //   'username': 'shawndrost',
  //   'text': 'trololo',
  //   'roomname': '4chan'
  // }]};

  console.log("Serving request type " + request.method + " for url " + request.url);

  // Verify a proper address
  if (request.url.slice(-17) === '/classes/messages') {
    // var statusCode = 404;
    // var headers = defaultCorsHeaders;
    // response.writeHead(statusCode, headers);
    // response.end();
  

    //Handle CORS options request
    if (request.method === 'OPTIONS') {
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      response.writeHead(statusCode, headers);
      response.end();
    }

    //Handle GET request
    if (request.method === 'GET') {

      var statusCode = 200;

      var headers = defaultCorsHeaders;

      headers['Content-Type'] = "application/json";

      response.writeHead(statusCode, headers);

      response.end(JSON.stringify(this.messages));

    } 

    //Handle POST request
    if (request.method === 'POST') {
      var statusCode = 201;
      var headers = defaultCorsHeaders;

       this.incomingMessage = '';

      request.on('data', function(data) {
        this.incomingMessage += data;
      }.bind(this));
      

      request.on('end', function() {
        this.incomingMessage = JSON.parse(this.incomingMessage);
        var process = true;

        // check username
        if (typeof this.incomingMessage['username'] !== 'string') {
          process = false;
        } else if (this.incomingMessage['username'].length > 20 && this.incomingMessage['username'].length < 1) {
          process = false;
        }

        // check text
        if (typeof this.incomingMessage['text'] !== 'string') {
          process = false;
        } else if (this.incomingMessage['text'].length > 1000 && this.incomingMessage['username'].length < 1) {
          process = false;
        }

        // check roomname
        if (typeof this.incomingMessage['roomname'] !== 'string') {
          process = false;
        } else if (this.incomingMessage['roomname'].length > 20 && this.incomingMessage['username'].length < 1) {
          process = false;
        }

        if (process) {
          this.messages.results.unshift(this.incomingMessage);
          headers['Content-Length'] = '' + JSON.stringify(this.incomingMessage).length;
          response.writeHead(statusCode, headers);
          delete headers['Content-Length'];

          // write to file
          fs.writeFile('messages.json', JSON.stringify(this.messages), "utf8");
        }
        
        response.end();
      }.bind(this));

      
    }
  }
};


var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = requestHandler;

