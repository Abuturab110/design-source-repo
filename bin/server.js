var app = require('../app');
var debug = require('debug')('design-source-app:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '4300');
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

function onListening() {
  var addr = server.address();
  debug('Listening on ' + port);
}

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
