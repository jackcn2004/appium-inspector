module.exports = ['$rootScope', '$scope', 'appium', function($rootScope, $scope, Appium) {

    $scope.currentNode = null;

    $scope.refresh = function(){
        Appium.takeScreenshot($rootScope.appium).then(function(data){
            $scope.screenshot = data.value;
        });

        Appium.takePageSource($rootScope.appium).then(function(data){

            $scope.pageSource = data.children;
        });
    };

    var log = document.getElementsByClassName('log')[0];

    Appium.log(function(transport, level, message, meta){
        log.appendChild(document.createTextNode(level.toUpperCase() + ': ' + message));
        log.appendChild(document.createElement('br'));

        log.scrollTop = log.scrollHeight;
    });

    $scope.select = function(node){
        $scope.currentNode = node;
    }
}]