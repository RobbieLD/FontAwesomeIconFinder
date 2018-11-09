angular.module("umbraco").controller("fontawesomeiconfinder",
    function ($scope, $element) {

        const iconsDataUrl = '/App_Plugins/FontAwesomeIconFinder/icons.json';

        // Create the manager
        var manager = new Manager($element[0]);

        // Hook up the key event
        $scope.keyup = (e) => {
            manager.handleKeyUp(e);
        };

        // Setup the controls
        manager.setup((value) => {
            $scope.model.value = value;
        }, iconsDataUrl);
    });