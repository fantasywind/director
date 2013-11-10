// Generated by CoffeeScript 1.6.3
(function() {
  var app, cookieParser, express, http, io, main, net, path, server, sessionStore, source;

  net = require('net');

  express = require('express');

  http = require('http');

  path = require('path');

  main = require('./routes/main');

  app = express();

  cookieParser = express.cookieParser('screct');

  sessionStore = new express.session.MemoryStore();

  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(cookieParser);
    app.use(express.session());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    return app.use(express["static"](path.join(__dirname, 'public')));
  });

  app.configure('development', function() {
    return app.use(express.errorHandler());
  });

  app.get('/', main.desktop);

  server = http.createServer(app);

  server.listen(app.get('port'), function() {
    return console.log("Directed Front server listening on port " + app.get('port'));
  });

  io = require('socket.io').listen(server);

  io.sockets.on('connection', function(socket) {
    socket.on('sourceOffer', function(data) {
      return socket.broadcast.emit('sourceOffer', {
        sdp: data.sdp
      });
    });
    socket.on('sourceAnswer', function(data) {
      return socket.broadcast.emit('sourceAnswer', {
        sdp: data.sdp
      });
    });
    return socket.on('candidate', function(data) {
      return socket.broadcast.emit('candidate', {
        candidate: data
      });
    });
  });

  source = net.createServer(function(conn) {
    conn.on('close', function() {
      return console.info('Service Close');
    });
    conn.on('connection', function() {
      return console.info('Client Connected.');
    });
    return conn.on('data', function(chunk) {
      var buf;
      console.log(chunk);
      buf = new Buffer(chunk);
      return console.log(buf.toString('utf8'));
    });
  });

  source.listen(5555, function() {
    return console.info('Service Bound on port 5555');
  });

}).call(this);