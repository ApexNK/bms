
(function (window, angular) {
    'use strict';
    angular.module("Service.UserContext", [])
        .service("UserContextService", ["$http", "$q", "ecHttp", "$window", "$filter", "EventBus", function ($http, $q, ecHttp, $window, $filter, EventBus) {
            var _primaryMenu = window.AppData.primaryMenu;
            var _secondaryMenu = window.AppData.secondaryMenu;
            var userInfo = null;

            var fnPrimaryMenu = function () {
                return _primaryMenu;
            };
            var fnSecondaryMenu = function (menu) {
                return _secondaryMenu[menu];
            };
            var fnLogOut = function () {
                ecHttp.Post("Account/LogOut").then(function (data) {
                    $window.location.href = "index.html";
                });
            };
            var fnLogin = function (user) {

                var deferred = $q.defer();
                var requestUrl = "admin/login";
                var result = ecHttp.Post(requestUrl, user);
                result.then(function (data) {
                        if (data.code === 0) {
                            fnSetUserInfo(data.value);
                            deferred.resolve(data.value);
                            return;
                        }
                        deferred.reject(data.Message);
                    },
                    function (data) {
                        deferred.reject(data.Message);
                    });
                return deferred.promise;
            };

            function fnSetUserInfo(data) {
                userInfo = data;
                EventBus.Publish("userInfoUpdate", userInfo);
            }

            function fnGetUserInfo() {
                return userInfo;
            }

            var fnSetSecondaryMenuName = function (menu, state, name) {
                angular.forEach(window.AppData.secondaryMenu[menu], function (item) {
                    for (var i = 0, length = item.Children.length; i < length; i++) {
                        if (state === item.Children[i].State) {
                            item.Children[i].Name = name;
                            return true;
                        }
                    }
                })
            };
            function fnSetParentMainView(scope) {
                scope.$on('$destroy', function () {
                    showParentMainContent(true);
                });

                function showParentMainContent(isShow) {
                    scope.$emit("showListContent", isShow);
                }

                showParentMainContent(false);
            }

            return {
                PrimaryMenu: fnPrimaryMenu,
                SecondaryMenu: fnSecondaryMenu,
                Logout: fnLogOut,
                Login: fnLogin,
                SetUserInfo: fnSetUserInfo,
                GetUserInfo: fnGetUserInfo,
                SetSecondaryMenuName: fnSetSecondaryMenuName,
                SetParentViewStatus: fnSetParentMainView
            };
        }]);
})(window, window.angular);
