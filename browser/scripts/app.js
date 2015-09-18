var appiumInspector = angular.module('appiumInspector', ['ngRoute', 'ui.layout', 'ngMaterial', 'ngFileUpload', 'treemendous']);

appiumInspector.factory('FSM', require('./service/fsm'));
appiumInspector.factory('Appium', require('./service/appium'));
appiumInspector.factory('Scenario', require('./service/scenario'));
appiumInspector.factory('Workspace', require('./service/workspace'));
appiumInspector.factory('Configuration', require('./service/configuration'));

appiumInspector.directive('dynamic', require('./directives/dynamic'));
appiumInspector.directive('inspector', require('./directives/inspector'));

appiumInspector.controller('MenuCtrl', require('./controller/menu/menu.js'));
appiumInspector.controller('MainCtrl', require('./controller/main'));
appiumInspector.controller('ScenarioCtrl', require('./controller/editor/scenarioEditor'));

appiumInspector.config(['$routeProvider', '$mdIconProvider', '$mdThemingProvider',
    function($routeProvider, $mdIconProvider, $mdThemingProvider) {
        //$routeProvider.
            //when('/settings', {
            //    templateUrl: 'browser/scripts/controller/settings.html',
            //    controller: 'SettingsCtrl'
            //}).
            //when('/editor', {
            //    templateUrl: 'browser/scripts/controller/scenarioEditor.html',
            //    controller: 'EditorCtrl'
            //}).
            //otherwise({
            //    redirectTo: '/editor'
            //});

        $mdIconProvider.defaultIconSet('browser/icons/fonts/icomoon.svg', 24);
        $mdThemingProvider.theme('default').dark();
    }]);

