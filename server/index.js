/*jshint node:true*/
'use strict';
var config = require('./config.json');
var io = require('socket.io')(config.port);

io.on('connection', function (socket) {
  
});