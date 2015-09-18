var remote = require('remote');

module.exports = ['$q', '$scope', 'FSM', 'Configuration', 'Appium', 'file', function($q, $scope, FSM, Configuration, Appium, file) {

    $scope.appium = null;
    $scope.capabilities = null;

    function startAppium(){
        return Appium.start($scope.capabilities.build()).then(function(appium){
            $scope.appium = appium;
        });
    };

    function stopAppium(){
        return Appium.stop($scope.appium).then(function () {
            $scope.appium = null;
        });
    }

    $scope.state = FSM.create({
        initial: 'loading',
        events: [
            {name: 'load', from: 'loading', to: 'none'},
            {name: 'start', from: 'none', to: 'running'},
            {name: 'stop', from: 'running', to: 'none'},
            {name: 'configure', from: 'none', to: 'configuring'},
            {name: 'cancel', from: 'configuring', to: 'none'},
            {name: 'save', from: 'configuring', to: 'none'}
        ],
        callbacks: {
            onleavenone: function (e, from, to) {
                if (to === 'running') {
                    //FIXME error handling
                    startAppium().then(function (instance) {
                        $scope.state.transition();
                    });

                    return 'async';
                }
            },

            onleaveconfiguring: function (event, from, to) {
                if (event === 'save') {
                    //fixme do not emit events
                    $rootScope.$emit('settings.save');
                }
            },

            onleaverunning: function (e, from, to) {
                //FIXME error handling
                stopAppium().then(function () {
                    $scope.state.transition();
                });

                return 'async';
            }
        }
    });

    //TODO better error handling
    Configuration.read(file).then(function(capabilities){
        $scope.capabilities = capabilities;
        $scope.state.load();

        console.log(file + ' loaded');
    });

    $scope.snapshot = function(){
        var screenShotPromise = Appium.takeScreenshot($scope.appium);
        var pageSourcePromise = Appium.takePageSource($scope.appium);

        $q.all({screenShot: screenShotPromise, pageSource: pageSourcePromise}).then(function(data){
            $scope.screenShot = data.screenShot;
            $scope.pageSource = data.pageSource;
        });
    }

}];