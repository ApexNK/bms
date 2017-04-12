
(function (window, angular) {
    'use strict';
    angular.module("app.manager", ["ui.router", "ngSanitize", "ui.bootstrap", "Manager.Widget", "toggle-switch", "toaster", "angular.filter", "Directive.All", "Controller.All", "Service.All", "Filter.All", "template-directive", "template-widget"])
        .run(["$document", "$rootScope", "ecHttp", "ecConfig", "$state", function ($document, $rootScope, ecHttp, ecConfig, $state) {
            ecConfig.initConfig();
            $document.bind("selectstart dragstart contextmenu", function () {
                return false;
            });

            $state.go("app.workboard.main");
        }])
        .controller("AppCtrl", ['$scope', "$state", '$rootScope', 'ecHttp', "UserContextService", function ($scope, $state, $rootScope, ecHttp, UserContextService) {
            $scope.app = {
                settings: {
                    sideNav: true,
                    topBar: true,
                    menuNav: true
                }
            };
            $scope.state = $state;
            $scope.app.settings.sideNav = false;
            ecHttp.Get("Account/UserInfo").then(function (data) {
                if (data.Code !== 0) {
                    return;
                }
                UserContextService.SetUserInfo(data.Value);
                $rootScope.CurrentUser = data.Value;
            });
            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    var stateStr = [];
                    stateStr = toState.name.split(".");
                    if (stateStr[2] == "main" && toState.name != "app.workboard.main") {
                        event.preventDefault();
                        var MenuItems = UserContextService.SecondaryMenu(stateStr[1]);
                        if (!!MenuItems && MenuItems[0].Children && MenuItems[0].Children.length > 0) {
                            $state.go(MenuItems[0].Children[0].State);
                        }
                        return;
                    }
                    if (toState.name === "app.store.homepage" || toState.name === "app.workboard.main" ) {
                        $scope.app.settings.sideNav = false;
                    } else {
                        $scope.app.settings.sideNav = true;
                    }
                }
            );
            $scope.$on('hideSideNav',
                function () {
                    $scope.app.settings.sideNav = false;
                }
            );
            $scope.$on('showSideNav',
                function () {
                    $scope.app.settings.sideNav = true;
                }
            );
        }])
        .config(['$stateProvider', '$urlRouterProvider', "$logProvider", function ($stateProvider, $urlRouterProvider, $logProvider) {
            $logProvider.debugEnabled(true);

            $stateProvider.state("app", {
                url: "",
                abstract: true,
                templateUrl: "view/app.html"

            });
            $stateProvider.state("app.workboard.main", {
                url: "/main",
                templateUrl: "view/workboard/main.html",
                controller: "WorkboardCtrl"
            });

            $stateProvider.state("app.workboard", {
                url: "/workboard",
                abstract: true,
                template: "<div ui-view></div>"
            });
            $stateProvider.state("app.business", {
                url: "/business",
                abstract: true,
                template: "<div ui-view></div>"
            });
        }]);

})(window, window.angular);