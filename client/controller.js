'use strict';
/*jshint node:true, quotmark:false*/
/*global angular, baseUrl, io, $*/
var app = angular.module("treeViewApp", ['ngToast']);
app.config(['ngToastProvider', function(ngToast) {
	ngToast.configure({
		verticalPosition: 'top',
		horizontalPosition: 'right'
	});
}]);
app.factory('socket', ['$rootScope', function() {
	var socket = io.connect(baseUrl);
	return {
		on: function(eventName, callback) {
			socket.on(eventName, callback);
		},
		emit: function(eventName, data) {
			socket.emit(eventName, data);
		}
	};
}]);
app.controller('mainController', function($scope, $http, ngToast, socket) {
	$scope.showFactory = false;
	$scope.factories = [];
	socket.emit('get_all_factories');
	socket.on('factory_created_success', function(data) {
		$scope.factories.push(data);
		$scope.$apply('factories');
	});
	socket.on('factory_created_fail', function() {
		ngToast.create({
			className: 'warning',
			content: '<h3>Failed to create factory.</h3>',
		});
	});

	socket.on('factories_fetch_success', function(data){
		$scope.factories = data;
		$scope.$apply('factories');
	});
	socket.on('factories_fetch_fail',function(){
		ngToast.create({
			className: 'warning',
			content: '<h3>Failed to fetch factory information.</h3>',
		});
	})

	$scope.createFactory = function() {
		var newFactory = {};
		socket.emit('create_factory', {
			factoryName: $scope.factoryName,
			min: $scope.min,
			max: $scope.max
		});
	};

});
app.directive('factoryForm', ['$compile', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			var rootButton = $("#root-button");
			var rootButtonOffset = rootButton.offset();
			var rootButtonWidth = rootButton.width();
			rootButton.on('mouseover', function() {
				element.css({
					"margin-top": rootButtonOffset.top,
					"margin-left": rootButtonOffset.left + rootButtonWidth + 40
				});
				scope.showFactory = true;
				scope.$apply();
			});
			rootButton.on('mouseleave', function() {
				scope.showFactory = false;
				scope.$apply();
			});
			element.on('mouseover', function() {
				scope.showFactory = true;
				scope.$apply();
			});
			element.on('mouseleave', function() {
				scope.showFactory = false;
				scope.$apply();
				clearForm();
			});

			function clearForm() {
				scope.factoryName = "";
				scope.min = "";
				scope.max = "";
				scope.factoryForm.$setPristine(true);
				scope.$apply();
			}
		}
	};
}]);