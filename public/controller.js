'use strict';
/*jshint node:true, quotmark:false*/
/*global angular, baseUrl, io, $, _*/
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
app.controller('mainController', function($scope, $http, ngToast, socket, $rootScope) {
	$scope.showFactory = false;
	$scope.factories = [];
	socket.emit('get_all_factories');
	socket.on('factory_created_success', function(data) {
		$scope.factories.push(data);
		$scope.$apply('factories');
		$rootScope.$broadcast('factory_created');
	});
	socket.on('factory_created_fail', function() {
		ngToast.create({
			className: 'warning',
			content: '<h3>Failed to create factory.</h3>',
		});
	});

	socket.on('factories_fetch_success', function(data) {
		$scope.factories = data;
		$scope.$apply('factories');
	});
	socket.on('factories_fetch_fail', function() {
		ngToast.create({
			className: 'warning',
			content: '<h3>Failed to fetch factory information.</h3>',
		});
	});

	$scope.createFactory = function() {
		$rootScope.$broadcast('factory_creating');
		socket.emit('create_factory', {
			factoryName: $scope.factoryName,
			min: $scope.min,
			max: $scope.max
		});
	};
	$scope.openMenu = function(passedEventObject, factoryId) {
		$scope.selectedFactoryId = factoryId;
		var element = passedEventObject.currentTarget.getBoundingClientRect();
		var x = element.left + element.width;
		var y = element.top;
		$scope.menuClass = {
			"left": x,
			"top": y
		};
		$scope.showFactoryMenu = true;
	};

	$scope.closeMenu = function() {
		$scope.childCount = "";
		$scope.showFactoryMenu = false;
		scope.childForm.$setPristine(true);
	};

	$scope.deleteFactory = function() {
		$scope.factoryDeleting = true;
		socket.emit('delete_factory', {
			id: $scope.selectedFactoryId
		});
	};

	socket.on('factory_deleted_success', function(data) {
		$scope.factories = _.without($scope.factories, _.findWhere($scope.factories, {
			_id: data.id
		}));
		$scope.factoryDeleting = false;
		$scope.showFactoryMenu = false;
		$scope.$apply('factories', 'factoryDeleting', 'showFactoryMenu');
	});

	socket.on('factory_deleted_fail', function() {
		ngToast.create({
			className: 'warning',
			content: '<h3>Failed to create factory.</h3>',
		});
		$scope.factoryDeleting = false;
		$scope.$apply('factoryDeleting');
	});
});
app.directive('factoryForm', ['$compile', function() {
	return {
		restrict: 'AE',
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
				scope.$apply('showFactory');
			});
			rootButton.on('mouseleave', function() {
				scope.showFactory = false;
				scope.$apply('showFactory');
			});
			element.on('mouseover', function() {
				scope.showFactory = true;
				scope.$apply('showFactory');
			});
			element.on('mouseleave', function() {
				if (!scope.factoryName && !scope.min && !scope.max) {
					scope.showFactory = false;
					scope.$apply('showFactory');
					clearForm();
				}
			});
			scope.closeFactoryForm = function() {
				scope.showFactory = false;
				clearForm();
			};
			scope.$on('factory_creating', function() {
				scope.creatingFactory = true;
			});

			scope.$on('factory_created', function() {
				scope.creatingFactory = false;
				clearForm();
				scope.showFactory = false;
				scope.$apply('showFactory');
			});

			function clearForm() {
				scope.factoryName = "";
				scope.min = "";
				scope.max = "";
				scope.factoryForm.$setPristine(true);
			}

		}
	};
}]);