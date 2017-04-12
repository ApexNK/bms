
(function(module) {
    try {
        module = angular.module('template-directive');
    } catch (e) {
        module = angular.module('template-directive', []);
    }
    module.run(['$templateCache', function($templateCache) {
        $templateCache.put('demo.html',
            '<div> </div>');
    }]);
})();
(function(module) {
    try {
        module = angular.module('template-widget');
    } catch (e) {
        module = angular.module('template-widget', []);
    }
    module.run(['$templateCache', function($templateCache) {
        $templateCache.put('demo.html',
            '<div> </div>');
    }]);
})();