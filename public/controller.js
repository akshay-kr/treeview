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
app.controller('mainController', function($scope, $http, ngToast, socket, $rootScope, $window, $document) {
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

	$scope.checkMax = function() {
		var min = parseInt($scope.min);
		var max = parseInt($scope.max);
		if (max <= min) {
			return false;
		} else {
			return true;
		}
	};

	$scope.openMenu = function(passedEventObject, factory) {
		$scope.selectedFactory = factory;
		var scrollY = $window.scrollY;
		var element = passedEventObject.currentTarget.getBoundingClientRect();
		var x = element.left + element.width;
		var y = element.top;
		var bottom = element.bottom;
		$rootScope.$broadcast('open-menu', {
			"x": x,
			"y": y,
			"bottom": bottom,
			"scrollY": scrollY
		});
	};

	$scope.closeMenu = function(forced) {
		if (!$scope.childCount || forced) {
			$scope.childCount = "";
			$scope.showFactoryMenu = false;
			$scope.childForm.$setPristine(true);
		}
	};

	$scope.deleteFactory = function() {
		$scope.factoryDeleting = true;
		socket.emit('delete_factory', {
			id: $scope.selectedFactory._id
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

	$scope.generateChild = function() {
		$scope.generatingChild = true;
		socket.emit('generate_child', {
			factory: $scope.selectedFactory,
			childCount: $scope.childCount
		});
	};

	socket.on('child_generated_success', function(data) {
		var match = _.find($scope.factories, function(factory) {
			return factory._id == data.id;
		});
		match.childrens = data.childrens;
		$scope.childCount = "";
		$scope.generatingChild = false;
		$scope.showFactoryMenu = false;
		$scope.$apply('factories', 'generatingChild', 'showFactoryMenu', 'childCount');
	});

	socket.on('child_generated_fail', function() {
		ngToast.create({
			className: 'warning',
			content: '<h3>Failed to generate childrens.</h3>',
		});
		$scope.childCount = "";
		$scope.generatingChild = false;
		$scope.$apply('generatingChild', 'childCount');
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

app.directive('childMenu', ['$compile', function() {
	return {
		restrict: 'AE',
		link: function(scope, element) {
			scope.$on("open-menu", function(event, args) {
				var x = args.x;
				var y = args.y;
				var bottom = args.bottom;
				var scrollY = args.scrollY;
				var height = element.actual('height');
				if (height > 0) {
					scope.showFactoryMenu = true;
					if (($(window).scrollTop() == $(document).height() - $(window).height()) && ($(window).scrollTop() > 0)) {
						element.css({
							"left": x,
							"top": (bottom + scrollY) - height
						});
						console.log("x: "+x);
						console.log("bottom: "+bottom);
						console.log("scrollY: "+scrollY);
						console.log("height: "+height);
					} else {
						element.css({
							"left": x,
							"top": y + scrollY
						});
					}
				}else{
					scope.showFactoryMenu = false;
				}
			});
		}
	};
}]);