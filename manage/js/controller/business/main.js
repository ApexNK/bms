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
            $stateProvider.state("app.business.category", {
             url: "/category",
             templateUrl:"view/business/categoryList.html",
             controller:'CompanyCategoryCtrl'
             });
            $stateProvider.state("app.business.scepter", {
                url: "/scepter",
                templateUrl:"view/business/scepter.html",
                controller:"ScepterCtrl"
            });
            //$stateProvider.state("app.business.splitAccount", {
            //    url: "/splitAccount",
            //    templateUrl: "view/business/splitAccountList.html",
            //    controller: 'SplitAccountCtrl'
            //});
            $stateProvider.state("app.business.ownMerchant", {
                url: "/ownMerchant",
                templateUrl: "view/business/ownMerchantList.html",
                controller: 'OwnMerchantCtrl'
            });
            $stateProvider.state("app.business.applySaler", {
                url: "/applySaler",
                templateUrl: "view/business/applySaler.html",
                controller: 'ApplyListCtrl'
            });
            //$stateProvider.state("app.business.applyShop", {
            //    url: "/applyShop",
            //    templateUrl: "view/business/applyShop.html",
            //    controller: 'ApplyShopCtrl'
            //});
            //$stateProvider.state("app.business.typeConvert", {
            //    url: "/typeConvert",
            //    templateUrl: "view/business/typeConvertList.html",
            //    controller: 'ConvertCtrl'
            //});
        }]);

})(window, window.angular);