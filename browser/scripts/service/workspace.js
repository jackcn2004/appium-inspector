
module.exports = ['$controller', 'Configuration', 'Scenario', function($controller, Configuration, Scenario) {
    var openTabs = [];
    return {
        openTabs: openTabs,

        read: function() {
            Configuration.read('workspace')
        },

        tabs: function() {
            return openTabs;
        },

        openTab: function(tab){
            openTabs.push(tab);
        }
    };
}];