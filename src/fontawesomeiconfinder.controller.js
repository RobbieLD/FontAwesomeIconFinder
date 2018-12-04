angular.module("umbraco").controller("fontawesomeiconfinder",
    function ($scope, $element) {

        const iconsDataUrl = '/App_Plugins/FontAwesomeIconFinder/icons.json';

        // Create the manager
        var manager = new Manager($element[0]);

        // Hook up the key event
        $scope.keyup = (e) => {
            manager.handleKeyUp(e);
        };

        // Hook up the clear button click event
        $scope.clear = function (e) {
            $scope.model.value = '';
            console.log("Icon cleared");
        };

        // Setup the controls
        manager.setup((value) => {
            $scope.model.value = value;
        }, iconsDataUrl);
    });