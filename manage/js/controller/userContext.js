/**
 * Created by huangww on 2016/6/2.
 */
(function (window, angular) {
    "use strict";
    angular.module("Controller.UserContext", [])
        .run([function () {

        }])
        .controller("MenuCtrl", ["$scope", "UserContextService", function ($scope, UserContextService) {
            $scope.Menus = UserContextService.PrimaryMenu();
        }])
        .controller("TopBarCtrl", ["$scope", "$window", "UserContextService", "EventBus", function ($scope, $window, UserContextService, EventBus) {
            $scope.logout = function () {
                UserContextService.Logout();
            };
            EventBus.Subscribe("userInfoUpdate", updateUserInfo);
            $scope.LoginUser = UserContextService.GetUserInfo();
            function updateUserInfo(data) {
                $scope.LoginUser = data;
            }

            $scope.$on("$destroy", function () {
                EventBus.Unsubscribe("userInfoUpdate", updateUserInfo);
            });

        }])
        .controller("SideNavCtrl", ['$scope', '$state', 'UserContextService', function ($scope, $state, UserContextService) {
            $scope.MenuItems = [];
            $scope.isCollapsed = false;
            function refreshMenu(type) {
                $scope.MenuItems = UserContextService.SecondaryMenu(type);
            }

            var PrimaryMenus = UserContextService.PrimaryMenu();

            $scope.currentPriMenu = {};
            var states = $state.current.name.split(".");
            setCurrentPrimaryMenu();

            refreshMenu(states[1]);
            $scope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    states = toState.name.split(".");
                    setCurrentPrimaryMenu();
                    if (states[1] === fromState.name.split(".")[1]) {
                        return;
                    }
                    refreshMenu(states[1]);
                });

            function setCurrentPrimaryMenu() {
                if (states.length < 3) {
                    return;
                }
                var stateName = states[0] + "." + states[1];
                for (var i = 0, leng = PrimaryMenus.length; i < leng; i++) {
                    if (stateName == PrimaryMenus[i].State) {
                        $scope.currentPriMenu = PrimaryMenus[i];
                        return;
                    }
                }
            }

        }])
    ;
})(window, window.angular);