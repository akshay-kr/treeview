'use strict';
/*jshint node:true, quotmark:false*/
/*global angular, console, baseUrl*/
var app = angular.module("treeViewApp", ['ngToast']);
app.controller('mainController', function($scope, $http, ngToast) {
	$scope.showFactory = false;

});
app.directive('factoryForm', ['$compile', function($compile) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var rootButton = $("#root-button");
			var offset = element.offset();
			rootButton.on('mouseover', function() {
				scope.showFactory = true;
				scope.$apply();
			});
			rootButton.on('mouseleave', function() {
				scope.showFactory = false;
				scope.$apply();
			});
			element.on('mouseover',function(){
				scope.showFactory = true;
				scope.$apply();
			});
			element.on('mouseleave',function(){
				scope.showFactory = false;
				scope.$apply();
				clearForm();
			});
			function clearForm() {
				scope.factoryName="";
				scope.min = "";
				scope.max="";
				scope.factoryForm.$setPristine(true);
				scope.$apply();
			}
		}
	};
}]);