/**
 * Created by aluedeke on 31.05.15.
 */
var Remote = require('remote');
var Appium = Remote.require('appium');
var defaultAppiumArgs = Remote.require('appium/lib/server/parser')().parseArgs();
var logger = Remote.require('appium/lib/server/logger').get('appium');

var async = require('async');
var xml2js = require('xml2js');

module.exports = ['$rootScope', '$q', '$interval', function($rootScope, $q, $interval) {

    function keepAlive(appiumServer){
        var intervalPromise = $interval(function(){ appiumServer.resetTimeout()}, appiumServer.commandTimeoutMs / 2);

        return function() {$interval.cancel(intervalPromise)};
    }

    function startAppiumServer(appiumShutdownDeferred){
        return function(cb){
            Appium.run(defaultAppiumArgs, function(appiumServer) {cb(null, appiumServer)}, function(){appiumShutdownDeferred.resolve()});
        }
    }

    function startAppiumSession(capabilities){
        return function(appiumServer, cb){
            appiumServer.start(capabilities, function(err, appiumSession) {
                cb(err, appiumServer, appiumSession)
            });
        }
    }

    return {
        start: function(capabilities){
            var appiumDeferred = $q.defer();
            var appiumShutdownDeferred = $q.defer();

            async.waterfall([startAppiumServer(appiumShutdownDeferred), startAppiumSession(capabilities)], function(err, server, session){
                if(err){
                    appiumDeferred.reject(err);
                } else {
                    appiumDeferred.resolve({server: server, session: session, donePromise: appiumShutdownDeferred.promise, stopKeepAlive: keepAlive(server)});
                }
            });

            return appiumDeferred.promise;
        },

        stop: function(appium){
            appium.stopKeepAlive();

            appium.session.stop(function(err, result){
                appium.server.shutdown();
            });

            return appium.donePromise;
        },

        takeScreenshot: function(appium){
            var imageDeferred = $q.defer();

            appium.server.device.getScreenshot(function(err, response){
                if(err){
                    imageDeferred.reject(err);
                } else {
                    imageDeferred.resolve(response.value);
                }
            });

            return imageDeferred.promise;
        },

        takePageSource: function(appium){
            var sourceDeferred = $q.defer();


            function toJSONObject(json, cb){
                return xml2js.parseString(json.value, {explicitRoot: false, explicitChildren: true, childkey: 'children', preserveChildrenOrder: true}, cb);
            }

            async.waterfall([appium.server.device.getPageSource, toJSONObject], function(err, json){
                if(err){
                    sourceDeferred.reject(err);
                } else {
                    sourceDeferred.resolve(json);
                }
            });

            return sourceDeferred.promise;
        },

        log: function(cb){
            logger.on('logging', cb);
            return { close: function(){ logger.remove('logging', cb)}};
        }
    };
}];
