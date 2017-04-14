(function (window, angular) {
    'use strict';
    angular.module("Controller.Business", ["Controller.Business.Manage"])
        .config(['$stateProvider',function($stateProvider){
            $stateProvider.state("app.business.main", {
                url: "/main",
                templateUrl:"view/business/main.html",
                controller:'BusinessMainCtrl'
            });
            $stateProvider.state("app.business.list", {
                url: "/list",
                templateUrl:"view/business/list.html",
                controller:"BusinessListCtrl"
            });
            $stateProvider.state("app.business.add", {
                url: "/add?Id&type",
                templateUrl:"view/business/addBusiness.html",
                controller:"AddBusinessCtrl"
            });
        }]);

})(window, window.angular);