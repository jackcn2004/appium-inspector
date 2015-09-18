var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var Dialog = remote.require('dialog');

module.exports = ['$rootScope', '$q', 'Workspace', function($rootScope, $q, Workspace) {
    function newScenario(){

    }

    //todo move into service
    function openFilePicker(){
        var deferred = $q.defer();

        var config = {
            title: "Select a scenario to open",
            properties: [ 'openFile' ],
            filters: [ { name: 'Scenario', extensions: ['appium'] }]
        };
        Dialog.showOpenDialog(config, function(selectedFiles){
            if(selectedFiles && selectedFiles[0]){
                $rootScope.$apply(function(){
                    deferred.resolve(selectedFiles[0])
                });
            } else {
                $rootScope.$apply(function(){
                    deferred.reject('no files selected')
                });
            }
        });

        return deferred.promise;
    }

    function openScenario(file){
        var appiumFileNameRegex = /.*\/(.*)\.appium/g

        var tab = {
            title: appiumFileNameRegex.exec(file)[1],
            view: 'browser/scripts/controller/editor/scenarioEditor.html',
            controller: 'ScenarioCtrl',
            file: file
        }

        Workspace.openTab(tab);
    }

    function openScreenObject(){

    }

    var template = [
        {
            label: 'Appium',
            submenu: [
                {
                    label: 'New Scenario',
                    click: newScenario
                },
                {
                    label: 'Open',
                    submenu: [
                        {
                            label: 'Scenario',
                            click: function(){
                                openFilePicker().then(openScenario);
                            }
                        },
                        {
                            label: 'Screen Object',
                            click: function(){
                                openFilePicker().then(openScenario);
                            }
                        }
                    ]
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Exit'
                },

            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: function() { remote.getCurrentWindow().reload(); }
                },
                {
                    label: 'Toggle DevTools',
                    accelerator: 'Alt+Command+I',
                    click: function() { remote.getCurrentWindow().toggleDevTools(); }
                },
            ]
        },
        {
            label: 'Help',
            submenu: [            {
                label: 'About Electron',
                selector: 'orderFrontStandardAboutPanel:'
            }]
        }
    ];

    //todo move into service
    menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);

    window.addEventListener('contextmenu', function (e) {
        console.log(e);

        e.preventDefault();
        var contextMenu = new Menu();
        contextMenu.append(new MenuItem({ label: 'Inspect Element', click: function() { remote.getCurrentWindow().inspectElement(e.x, e.y) } }));

        contextMenu.popup(remote.getCurrentWindow());
    }, false);
}]