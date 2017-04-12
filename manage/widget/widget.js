(function (window, angular) {
    'use strict';
    angular.module("Manager.Widget", ['ngFileUpload'])
        .constant("MESG_TYPE", {Error: 0, Warn: 1, Success: 2, Note: 3, Ask: 4, Invalid: 5})
        .service("ecWidget", ["$q", "$modal", '$log', 'securityRetryQueue', "toaster", "MESG_TYPE", function ($q, $modal, $log, queue, toaster, MESG_TYPE) {
            var fnShowLoginModal = function () {
                var instance = $modal.open({
                    animation: true,
                    templateUrl: 'widget/modal/login.html',
                    controller: 'LoginCtrl',
                    backdrop: "static",
                    keyboard: false
                });
                instance.result.then(function (name) {
                        queue.retryAll();
                    },
                    function (reason) {
                        $log.log(reason);
                    });
            };
            var fnShowMessage = function (content, type, config) {
                var dft = {
                    Type: MESG_TYPE.Error,
                    OkName: "确定",
                    NoName: "取消",
                    Content: {
                        Message: "出错啦！",
                        Code: ""
                    }
                };

                var instance = $modal.open({
                    animation: false,
                    backdrop: "static",
                    keyboard: false,
                    templateUrl: 'widget/modal/message.html',
                    controller: 'MessageCtrl',
                    resolve: {
                        settings: function () {
                            angular.extend(dft, config);
                            if (!!content) {
                                if (angular.isString(content)) {
                                    dft.Content.Message = content;
                                } else {
                                    dft.Content = content;
                                }
                            }
                            if (!!type) {
                                dft.Type = type;
                            }
                            return dft;
                        }
                    }
                });
                return instance.result;
            };
            var fnSetPicture = function (config) {
                var dft = {
                    Type: 7,    //弹出框类型：1-local 2-net 3--space
                    Number: 1,
                    Force: true,// true 代表必须选择{{number}}个图片，false表示可以少于{{Number}}个图片
                    Size: 250000,//默认图片最大为250k
                    FileType: ".jpeg,.png,.jpg"//默认的图片格式
                };

                var instance = $modal.open({
                    animation: false,
                    //size:"lg",
                    templateUrl: 'widget/modal/picture.html',
                    controller: 'PictureCtrl',
                    resolve: {
                        settings: function () {
                            angular.extend(dft, config);
                            return dft;
                        }
                    }
                });
                return instance.result;

            };
            var fnSetPictureInfo = function (title, link, productCode, multiTarget) {
                var data = {Title: "", Link: "", ProductCode: ""};
                var instance = $modal.open({
                        animation: false,
                        templateUrl: 'widget/modal/pictureInfo.html',
                        controller: 'PictureInfoCtrl',
                        resolve: {
                            setting: function () {
                                if (!!title) {
                                    data.Title = title;
                                }
                                if (!!link) {
                                    data.Link = link;
                                }
                                if (!!productCode) {
                                    data.ProductCode = productCode;
                                }
                                if (!!multiTarget) {
                                    angular.extend(data, multiTarget);
                                }
                                return data;
                            }
                        }
                    }
                );
                return instance.result;
            };
            function fnShowToaster(type, title, text) {
                toaster.pop({
                    type: type,
                    title: title,
                    body: text,
                    showCloseButton: false,
                    timeout: 2000
                });
            }

            window.ecWidget = window.ecWidget || {};
            window.ecWidget.SetPicture = fnSetPicture;
            return {
                ShowLoginModal: fnShowLoginModal,
                SetPicture: fnSetPicture,
                ShowMessage: fnShowMessage,
                SetPictureInfo: fnSetPictureInfo,
                ShowToaster: fnShowToaster
            };

        }])
        .controller("MessageCtrl", ['$scope', '$modalInstance', 'settings', 'MESG_TYPE', function ($scope, $modalInstance, settings, MESG_TYPE) {
            $scope.settings = settings;
            $scope.Type = MESG_TYPE;
            $scope.ok = function () {
                $modalInstance.close("ok");
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }])
        .controller("LoginCtrl", ['$scope', '$window', '$modalInstance', 'UserContextService','$rootScope', function ($scope, $window, $modalInstance, UserContextService,$rootScope) {

            $scope.user = {"LoginName": "", "Password": ""};
            $scope.failLogin = false;
            $scope.showFormError = false;
            $scope.login = function (isValid) {
                if (!isValid) {
                    $scope.showFormError = true;
                    return;
                } else {
                    $scope.showFormError = false;
                }
                var result = UserContextService.Login($scope.user, true);
                result.then(function (data) {
                        $scope.failLogin = false;
                        $rootScope.CurrentUser = data;
                        $modalInstance.close(data);
                    },
                    function (data) {
                        $scope.failLogin = true;
                        $scope.Message = data;
                        $scope.user.Password = "";
                    });

            };
            $scope.cancel = function () {
                $modalInstance.dismiss("cancel");
                $window.location.href = "index.html";
            };
        }])
        .controller("PictureCtrl", ['$scope', '$modalInstance', '$q', 'Upload', '$log', 'settings', 'ecConfig', "ecWidget", "ecNavigator",
            function ($scope, $modalInstance, $q, Upload, $log, settings, ecConfig, ecWidget, ecNavigator) {

                $scope.pictureFile = settings;
                $scope.remindMessage = "温馨提示，图片格式" + $scope.pictureFile.FileType.replace(/,/g, '、') + ", 大小限制" + Math.ceil(settings.Size / 1000) + "KB" + "，请选择" + settings.Number + "张图片上传";
                $scope.isSelected = false;
                var isIE8 = ecNavigator.IsIE8();

                var uploadFiles = function (files) {
                    var uploadList = [];
                    var upload;
                    for (var i = 0; i < files.length; ++i) {
                        upload = Upload.upload({
                            url: ecConfig.getConfig().baseUrl.Upload,
                            data: {
                                file: files[i].Url
                            }
                        });
                        uploadList.push(upload);
                    }
                    var allUplaod = $q.all(uploadList);
                    allUplaod.then(function (resp) {
                            return resp;
                        },
                        function (resp) {
                            ecWidget.ShowToaster("error", "", "图片上传失败");
                            return resp;
                        }
                    );
                    return allUplaod;
                };

                $scope.ok = function () {
                    var files = [];
                    var data = [];
                    if (isIE8) {
                        if (settings.Number == 1 && $scope.selected.items.length == 1) {
                            $modalInstance.close($scope.selected.items[0]);
                            return;
                        }
                        $modalInstance.close($scope.selected.items);
                        return;
                    }

                    for (var i = 0; i < $scope.selected.items.length; ++i) {
                        if ($scope.selected.items[i].Type != "Local") {//非本地文件，不需要上传
                            data.push({Url: $scope.selected.items[i].Url, Type: $scope.selected.items[i].Type});
                            continue;
                        }
                        files.push($scope.selected.items[i]);
                    }
                    var allUplaod = uploadFiles(files);
                    allUplaod.then(function (resp) {
                            for (var i = 0; i < resp.length; ++i) {
                                data.push({Url: resp[i].data.Value.Key, Type: "Local"});
                            }
                            if (settings.Number == 1 && $scope.selected.items.length == 1) {
                                $modalInstance.close(data[0]);
                                return;
                            }
                            $modalInstance.close(data);
                        }
                    );
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.selected = {items: []};
                $scope.selectItem = function (item) {
                    if ($scope.selected.items.length >= settings.Number) {
                        var temp = $scope.selected.items.shift();
                        $scope.$broadcast(temp.Type, temp.Index);
                    }
                    $scope.selected.items.push(item);
                };
                $scope.unselectItem = function (item) {
                    var i = 0;
                    for (i = 0; i < $scope.selected.items.length; ++i) {
                        if ($scope.selected.items[i].Type == item.Type && $scope.selected.items[i].Index == item.Index) {
                            $scope.selected.items.splice(i, 1);
                            break;
                        }
                    }
                };
                $scope.uploadFiles = uploadFiles;

            }])
        .controller("PicLocalCtrl", ['$scope', '$timeout', "ecWidget", "ecNavigator", function ($scope, $timeout, ecWidget, ecNavigator) {
            $scope.items = [];
            $scope.files = [];
            var prevFiles = [];
            $scope.isIE8 = ecNavigator.IsIE8();

            ecNavigator.ShowFlashHint();

            $scope.$on("Local", function (event, index) {
                $scope.items[index].Selected = false;
            });
            $scope.select = function (index) {
                var selected = !$scope.items[index].Selected;
                var item = {Url: $scope.items[index].Url, Type: "Local", Index: index};
                $scope.items[index].Selected = selected;
                if (selected) {
                    $scope.selectItem(item);
                }
                else {
                    $scope.unselectItem(item);
                }
            };

            var preview = function () {
                var files = [];
                if ($scope.files === null || $scope.files.length === 0) {
                    return;
                }

                //解决IE8上传两次的问题
                if ($scope.isIE8 && (prevFiles.length > 0) && (prevFiles[0].id == $scope.files[0].id)) {
                    prevFiles = [];
                    return;
                }
                prevFiles = angular.copy($scope.files);

                for (var i = 0; i < $scope.files.length; ++i) {
                    var item = {Url: $scope.files[i]};
                    if ($scope.isIE8) {
                        files.push(item);
                    } else {
                        setPreviewItems(item);
                    }
                }

                if ($scope.isIE8) {
                    $scope.uploadFiles(files).then(function (resp) {
                        for (var i = 0; i < resp.length; ++i) {
                            var item = {Url: resp[i].data.Value.Key};
                            setPreviewItems(item);
                        }
                    });
                }
            };

            function setPreviewItems(item) {
                angular.extend(item, {Selected: true, Type: "Local", Index: $scope.items.length});
                $scope.items.push(item);
                $scope.selectItem(item);
            }

            $scope.checkFileValidate = function (file) {
                if (file.type.indexOf("image") == -1) {
                    ecWidget.ShowToaster("error", "提示", "文件格式错误，请选择图片");
                    return false;
                }
                var index = file.type.indexOf("/");
                var typeName = file.type.substring(index + 1);
                if ($scope.pictureFile.FileType.indexOf(typeName) == -1) {
                    ecWidget.ShowToaster("error", "提示", "图片格式错误，请重新选择");
                    return false;
                }
                if (file.size > $scope.pictureFile.Size) {
                    ecWidget.ShowToaster("error", "提示", "图片大小超过了" + Math.ceil($scope.pictureFile.Size / 1000) + "K");
                    return false;
                }
                return true;
            };
            $scope.preview = preview;

        }])
        .controller("PictureInfoCtrl", ['$scope', '$modalInstance', 'setting', "LINK_TARGET_TYPE", function ($scope, $modalInstance, setting, LINK_TARGET_TYPE) {
            $scope.data = {Title: setting.Title, Link: setting.Link, ProductCode: setting.ProductCode};
            $scope.linkType = {
                TargetType: LINK_TARGET_TYPE.NO_TARGET,
                TargetValue: ""
            };
            $scope.showMultiTarget = false;
            if (angular.isDefined(setting.TargetType)) {
                $scope.linkType.TargetType = setting.TargetType;
                $scope.linkType.TargetValue = setting.TargetValue;
                $scope.showMultiTarget = true;
                $scope.platForm = setting.Platform;
            }
            $scope.ok = function (isValid) {
                if (!isValid) {
                    $scope.submitted = true;
                    return;
                }
                var data = {};
                data = angular.copy($scope.data);
                if ($scope.showMultiTarget) {
                    angular.extend(data, $scope.linkType);
                }
                $modalInstance.close(data);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }])
    ;
})(window, window.angular);
