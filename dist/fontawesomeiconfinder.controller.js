"use strict";

angular.module("umbraco").controller("fontawesomeiconfinder", function ($scope, $element) {
  var iconsDataUrl = '/App_Plugins/FontAwesomeIconFinder/icons.json'; // Create the manager

  var manager = new Manager($element[0]); // Hook up the key event

  $scope.keyup = function (e) {
    manager.handleKeyUp(e);
  }; // Setup the controls

  $scope.clear = function (e) {
    $scope.model.value = '';
    console.log("Icon cleared");
  }; // Setup the clear control

  manager.setup(function (value) {
    $scope.model.value = value;
  }, iconsDataUrl);
});