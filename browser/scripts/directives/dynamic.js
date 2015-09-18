
module.exports = ['$rootScope', '$controller', 'Workspace', function($rootScope, $controller, Workspace) {
    return {
        restrict: 'E',
        scope: {
            src: '@',
            controller: '@',
            file: '@'
        },
        template: '<div ng-include="src"></div>',
        controller: function($scope) {
            return $controller($scope.controller, { $scope: $scope, file: $scope.file});
        },
    }
}];