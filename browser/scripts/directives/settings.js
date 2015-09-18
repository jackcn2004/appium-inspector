module.exports = ['$rootScope', '$scope', 'configuration', function($rootScope, $scope, configuration) {

    $scope.warnJavaHome = !process.env['JAVA_HOME'];
    $scope.warnAndroidHome = !process.env['ANDROID_HOME'];

    $scope.file = {};
    $scope.$watch('file.apk', function (file) {
        if(file && file[0]){
            $scope.settings.capabilities.android.app = file[0].path;
        }
    });

    $scope.settings = {
        platform: { active: 'android'},
        capabilities: {
            android: {},
            ios: {}
        },
        activeCapabilities:{
            appUnderTest: 'apk',
            device: 'realDevice'
        }
    };

    configuration.read('capabilities').then(function(settings){
        if(settings){
            $scope.settings = settings;
        }
    });

    var onSettingsSaveListenerHandle = $rootScope.$on('settings.save', function(){
        configuration.save('capabilities', $scope.settings);
    });

    $scope.$on("$destroy", function(){
        onSettingsSaveListenerHandle();
    });

}];