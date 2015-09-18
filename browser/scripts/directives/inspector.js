
module.exports = ['$rootScope', '$controller', 'Appium', function($rootScope, $controller, Appium) {
    return {
        restrict: 'E',
        scope: {
            screenshot: '=',
            pagesource: '='
        },
        templateUrl: 'browser/scripts/directives/inspector.html',
        link: function(scope, element, attributes){
            var logElement = $(element).find('.log');

            var logHandle = Appium.log(function(transport, level, msg, meta){
                logElement.append('<div>' + level + ': ' + msg + '</div>');
            });

            scope.$on('$destroy', function() {
                //FIXME doesn't get called on page refresh
                logHandle.close();
            });

        }
    }
}];