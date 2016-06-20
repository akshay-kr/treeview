/*jshint node:true*/
'use strict';
var config = require('./config.json');
var express = require('express');
var app = express();
var q = require('q');
var mongodb = require('mongodb');
var cors = require('cors');
var path = require('path');
var MongoClient = mongodb.MongoClient;
var mongoConnectionUrl = config.mongoConnUrl;
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// viewed at http://localhost:8080
//app.use(express.static('files'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
var server = app.listen(config.port);
var io = require('socket.io').listen(server);
var dbInstance = null;
io.on('connection', function(socket) {
	socket.on('get_all_factories', function() {
		createMongoClient().then(function() {
			return getAllFactories();
		}).then(function(data) {
			socket.emit('factories_fetch_success', data);
			socket.broadcast.emit('factories_fetch_success', data);
		}, function(err) {
			console.log(err);
			socket.emit('factories_fetch_fail');
			socket.broadcast.emit('factories_fetch_fail');
		});
	});
	socket.on('create_factory', function(data) {
		createMongoClient().then(function() {
			return saveFactory(data);
		}).then(function() {
			socket.emit('factory_created_success', data);
			socket.broadcast.emit('factory_created_success', data);
		}, function(err) {
			console.log(err);
			socket.emit('factory_created_fail');
			socket.broadcast.emit('factory_created_fail');
		});
	});
});

function createMongoClient() {
	var deferred = q.defer();
	if (!dbInstance) {
		MongoClient.connect(mongoConnectionUrl, function(err, db) {
			if (!err) {
				dbInstance = db;
				deferred.resolve();
			} else {
				deferred.reject(err);
			}
		});
	} else {
		deferred.resolve();
	}
	return deferred.promise;
}

function getAllFactories() {
	var deferred = q.defer();
	if (dbInstance) {
		// Get the documents collection
		var collection = dbInstance.collection(config.collection);
		// Insert some users
		collection.find({}).toArray(function(err, result) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(result);
			}
		});
	} else {
		deferred.reject("Db instance not found.");
	}
	return deferred.promise;
}

function saveFactory(data) {
	var deferred = q.defer();
	if (dbInstance) {
		// Get the documents collection
		var collection = dbInstance.collection(config.dbName);
		// Insert some users
		collection.insert(data, function(err) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});
	} else {
		deferred.reject("Db instance not found.");
	}
	return deferred.promise;
}