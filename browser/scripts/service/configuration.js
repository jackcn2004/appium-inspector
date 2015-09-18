/**
 * Created by aluedeke on 31.05.15.
 */
var fs = require('fs');
var path = require('path');
var touch = require('touch');

var async = require('async');

module.exports = ['$rootScope', '$q', function($rootScope, $q) {
    var homeDirectoryPath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    var workingDirectoryPath = homeDirectoryPath + path.sep + '.appium-inspector';
    var configFileExtension = '.json';

    function createWorkingDirectory(callback){
        if (!fs.existsSync(workingDirectoryPath)){
            fs.mkdir(workingDirectoryPath, callback);
        } else {
            callback();
        }
    }

    function touchConfigurationFile(platform){
        return function(callback) {
            touch(workingDirectoryPath + path.sep + platform + configFileExtension, undefined, callback);
        }
    }

    function readFile(file){
        return function(callback) {
            fs.readFile(file, "utf8", callback);
        }
    }

    function saveConfigurationFile(platform, content){
        return function(callback) {
            fs.writeFile(workingDirectoryPath + path.sep + platform + configFileExtension, content, callback);
        }
    }

    var Configuration = function(config){
        for (var prop in config) this[prop] = config[prop];
    }

    Configuration.prototype.build = function(){
        var platform = this.platform.active;

        var appType = this.activeCapabilities[platform].appUnderTest;
        var deviceType = this.activeCapabilities[platform].device;

        var capabilties = {
            platformName: platform,
            deviceName: deviceType
        }

        if(appType==='apk'){
            capabilties.app = this.capabilities[platform].app;
        }

        if(appType==='preinstalled'){
            capabilties.appPackage = this.capabilities[platform].appPackage;
            capabilties.appActivity = this.capabilities[platform].appActivity;
        }

        return capabilties;
    }

    return {
        read: function(file){
            var configDeferred = $q.defer();

            fs.readFile(file, "utf8", function(err, configuration){
                $rootScope.$apply(function(){
                    if(err){
                        configDeferred.reject(err);
                    }

                    configDeferred.resolve(configuration ? new Configuration(JSON.parse(configuration)) : undefined);
                });
            });

            return configDeferred.promise;
        },

        save: function(platform, config){
            var configDeferred = $q.defer();

            async.series([createWorkingDirectory, touchConfigurationFile(platform), saveConfigurationFile(platform, JSON.stringify(config, null, 4))],
                function(err, results){
                    $rootScope.$apply(function(){
                        if(err){
                            configDeferred.reject(err);
                        }

                        configDeferred.resolve();
                    });
                });

            return configDeferred.promise;
        }
    };
}];
