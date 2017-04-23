/**
 * Created by huangww on 2016/1/6.
 */
(function (window, angular) {
    'use strict';
    angular.module("public.manager", ["ui.router", "ui.bootstrap", "Manager.Widget", "toaster", "angular.filter", "Service.All", "Filter.All", "Directive.All", "template-directive", "template-widget"])
        .run(["$document", "$rootScope", "ecConfig", "$state", function ($document, $rootScope, ecConfig, $state) {
            ecConfig.initConfig();
            $state.go("login");
        }])
        .config(['$stateProvider', "$logProvider", function ($stateProvider, $logProvider) {
            $logProvider.debugEnabled(true);

            $stateProvider.state("login", {
                url: "/login",
                templateUrl: "view/login/login.html",
                controller: "LoginPageCtrl"
            });

            $stateProvider.state("forgetPassword", {
                url: "/forgetPassword",
                templateUrl: "view/login/forgetPassword.html",
                controller: "ForgetPwdCtrl"
            });
        }])
        .controller("MainLoginCtrl", ['$scope', function ($scope) {
            $scope.userinfo = {
                loginName: ""
            };
        }])
        .controller("LoginPageCtrl", ['$scope', '$window', "UserContextService", "$state", function ($scope, $window, UserContextService, $state) {
            $scope.failLogin = false;
            $scope.showFormError = false;
            $scope.user = {username: "", password: ""};

            $scope.reset = function () {
                $scope.user = {username: "", password: ""};
            };
            $scope.resetMessage = function () {
                $scope.failLogin = false;
            };
            $scope.login = function (isValid) {
                if (!isValid) {
                    $scope.showFormError = true;
                    return;
                } else {
                    $scope.showFormError = false;
                }

                var result = UserContextService.Login($scope.user);
                result.then(function (data) {
                        debugger;
                        $scope.failLogin = false;
                        $scope.userinfo.loginName = $scope.user.username;
                        $window.location.href = "main.html";
                    },
                    function (data) {
                        $scope.failLogin = true;
                        $scope.Message = data;
                        $scope.user.password = "";
                    });

            };
        }])
        .controller("ForgetPwdCtrl", ['$scope', 'ecHttp', '$state', 'ecWidget', 'MESG_TYPE', "$timeout", function ($scope, ecHttp, $state, ecWidget, MESG_TYPE, $timeout) {
            $scope.submitted = false;
            $scope.stepInfo = [
                {
                    desc: "验证登录名"
                },
                {
                    desc: "修改密码"
                }
            ];
            $scope.forgetPwdModel = {
                LoginName: "",
                Phone: "",
                NewPassword: "",
                ConfirmPassword: "",
                SmsCode: ""
            };
            $scope.isNoLoginName = false;
            $scope.loginName = "";
            $scope.currentStep = 0;
            $scope.showed = true;
            $scope.timeNext = 0;
            $scope.goLogin = function () {
                $state.go("login");
            };
            $scope.next = function (isValid) {
                $scope.submitted = false;
                switch ($scope.currentStep) {
                    case 0:
                        if (!isValid) {
                            $scope.submitted = true;
                            return;
                        }
                        $scope.currentStep++;
                        break;
                    case 1:
                        if (!isValid) {
                            $scope.submitted = true;
                            return;
                        }
                        $state.go("login");
                        break;
                }
            };

            $scope.resetState = function () {
                $scope.isNoLoginName = false;
            }

            $scope.checkLoginName = function (isValid) {
                if (!isValid) {
                    $scope.submitted = true;
                    return;
                }
                var param = {};
                param.LoginName = $scope.forgetPwdModel.LoginName;
                ecHttp.Get("Account/SoamCheckLoginName", param).then(function (data) {
                    if (data.Code !== 0) {
                        $scope.isNoLoginName = true;
                        return;
                    }
                    $scope.isNoLoginName = false;
                    $scope.forgetPwdModel.Phone = data.Value;
                    $scope.currentStep = 1;
                    $scope.submitted = false;
                });
            };
            $scope.getSmsCode = function () {
                ecHttp.Get("Account/SoamGetSmsCode", {"loginName": $scope.forgetPwdModel.LoginName}).then(function (data) {
                    if (data.Code !== 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    $scope.timeNext = data.Value;
                    $scope.showed = false;
                    var updateClock = function () {
                        $timeout(function () {
                            --$scope.timeNext;
                            if ($scope.timeNext > 0) {
                                updateClock();
                            }
                        }, 1000);
                    };
                    updateClock();
                });
            };

            $scope.updatePwd = function (isValid) {
                if (!isValid) {
                    $scope.submitted = true;
                    return;
                }
                if ($scope.forgetPwdModel.NewPassword != $scope.forgetPwdModel.ConfirmPassword) {
                    ecWidget.ShowMessage("密码输入不一致，请重新输入！");
                    return;
                }
                ecHttp.Post("Account/SoamRetrievePassword", $scope.forgetPwdModel).then(function (data) {
                    if (data.Code !== 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    ecWidget.ShowMessage("修改密码成功，请重新登录！", MESG_TYPE.Note).then(
                        function () {
                            $state.go("login");
                            return;
                        }
                    );
                });
            };
        }])
    ;
})(window, window.angular);