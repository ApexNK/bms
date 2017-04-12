
angular.module("Directive.All", ["Directive.Validation"])
    .directive("ecCheck", function () {
        return {
            scope: {checked: "="},
            restrict: "A",
            replace: "true",
            template: "<i class='fa' ng-class=\"{'fa-check base-color':checked,'fa-close':!checked}\"></i>",
            link: function (scope, elem, attrs) {

            }
        };
    })
    .directive('ecCheckBox', ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            templateUrl: 'js/directive/tpl/checkTemplate.html',
            replace: true,
            scope: {
                ecChecked: '=',
                ecClick: '&',
                ecDisabled:'='
            },
            link: function (scope, element, attrs, event) {
                scope.toggleIcon = function (event) {
                    if(scope.ecDisabled == true){
                        return;
                    }
                    if (scope.ecChecked == "notall") {
                        scope.ecChecked = true;
                    }
                    else {
                        scope.ecChecked = !scope.ecChecked;
                    }
                    event.stopPropagation();
                    $timeout(function () {
                        scope.ecClick();
                    });
                };
            }
        };
    }])
    .directive("ecShadow", [function () {
        return {
            restrict: "A",
            replace: "true",
            scope: {
                shadowSetLeft: "&",
                shadowSetRight: "&",
                shadowLeftLabel: "@",
                shadowRightLabel: "@",
                shadowHideLeft: "@",
                shadowHideRight: "@",
                shadowInfo: "@"
            },
            template: "<div class='shadow'>" +
            "<div class='set'>" +
            "<span ng-click='shadowSetLeft()' ng-hide='hideLeftLabel'>{{leftLabel}}</span>" +
            "<span ng-hide='hideLeftLabel'>|</span> " +
            "<span ng-click='shadowSetRight()' ng-hide='hideRightLabel'>{{rightLabel}}</span>" +
            "</div>" +
            "<div class='info'>{{shadowInfo}}</div>" +
            "<div class='transparency'></div>" +
            "</div>",
            link: function (scope, ele, attrs) {
                scope.leftLabel = scope.shadowLeftLabel || "修改图片";
                scope.rightLabel = scope.shadowRightLabel || "修改信息";
                if (angular.isDefined(scope.shadowHideLeft)) {
                    scope.hideLeftLabel = scope.shadowHideLeft == "true";
                } else {
                    scope.hideLeftLabel = false;
                }
                if (angular.isDefined(scope.shadowHideRight)) {
                    scope.hideRightLabel = scope.shadowHideRight == "true";
                } else {
                    scope.hideRightLabel = false;
                }
            }
            //templateUrl:"js/directive/shadow.html"
        };
    }])
    .directive("ecImgShadow", [function () {
        return {
            restrict: "A",
            replace: "true",
            scope: {
                shadowEdit: "&",
                shadowRemove: "&",
                shadowInfo: "@"
            },
            template: "<div class='shadow'>" +
            "<div class='set'>" +
            "<span ng-click='shadowEdit()'>修改</span> | <span ng-click='shadowRemove()'>删除</span>" +
            "</div>" +
            "<div class='info'>{{shadowInfo}}</div>" +
            "<div class='transparency'></div>" +
            "</div>"
        };
    }])
    .directive("ecImgInfo", [function () {
        return {
            restrict: "A",
            replace: "true",
            scope: {
                imgEdit: "&",
                imgRemove: "&",
                imgMoveL: "&",
                imgMoveR: "&"
            },
            template: "<div class='shadow'>" +
            "<div class='set'>" +
            "<span ng-click='imgEdit()'>编辑</span> | <span ng-click='imgRemove()'>删除</span>" +
            "</div>" +
            "<div class='move-lr'>" +
            "<span>" + "<i class='fa fa-arrow-left' ng-click='imgMoveL()' title='左移'></i></span>" +  //左右移动功能保留
            "&emsp;&emsp;<span><i class='fa fa-arrow-right' ng-click='imgMoveR()' title='右移'></i></span>" +
            "</div>" + "<div class='transparency'></div>" +
            "</div>"
        };
    }])
    .directive("ecModuleConfig", [function () {
        return {
            restrict: "A",
            replace: "true",
            scope: false,
            templateUrl: "js/directive/tpl/moduleconfig.html"
        };
    }])
    .directive("ecDownloadFile", ['$compile', function ($compile) {
        return {
            restrict: "A",
            replace: "false",
            scope: {
                downloadUrl: "=",
                downloadParam: "="
            },
            link: function (scope, element, attrs) {
                var template = "<div class='hidden'>" +
                    "<form  action='{{downloadUrl}}' method='post' id='myform' target='ecDownloadFileForm'>" +
                    "<div ng-repeat='(key,value) in downloadParam'>" +
                    "<input type='text' name='{{key}}' ng-model='value'/>" +
                    "</div>" +
                    "</form>" +
                    "</div>" +
                    "<iframe name='ecDownloadFileForm' ng-hide='true'></iframe>";
                var formTemplate = angular.element(template);
                $compile(formTemplate)(scope);
                element.after(formTemplate);

                element.on("click", submitRequest);
                function submitRequest() {
                    formTemplate[0].firstChild.submit();

                }
            }
        };
    }])
    .controller("PageInfoCtrl", ["$scope", "$attrs", function ($scope, $attrs) {
        $scope.changePageSize = function () {
            $scope.pageInfo.CurPage = 1;
            $scope.ecRefresh();
        };
        $scope.pageChange = function () {
            $scope.ecRefresh();
        };
    }])
    .directive("ecPageInfo", function () {
        return {
            restrict: "A",
            replace: true,
            scope: {
                pageInfo: "=ngModel",
                ecRefresh: "&"
            },
            templateUrl: "js/directive/tpl/pageInfo.html",
            controller: 'PageInfoCtrl'
        };
    })
    .directive("ecCheckCircle", function () {
        return {
            scope: {
                circleChecked: "=",
                circleTitle: "@"
            },
            restrict: "A",
            replace: "true",
            template: "<div class='check-circle'>" +
            "<i class='ec ec-check-circle base-color' ng-if='circleChecked'></i>" +
            "<i class='ec ec-check-circle' ng-if='!circleChecked'></i><span>{{circleTitle||'设置默认'}}</span></div>"
        };
    })
    .directive("ecPathInfo", ['$state', '$compile', 'UserContextService', function ($state, $compile, UserContextService) {
        return {
            restrict: "A",
            replace: "true",
            link: function (scope, element, attrs, ctrl) {
                var curState = [];
                var secondaryMenu = [];
                scope.pathInfo = [];
                var platform = UserContextService.Platform();
                if (angular.isDefined(attrs.breadCrumb)) {
                    scope.pathInfo = scope.$parent.$eval(attrs.breadCrumb);
                } else {
                    parsePathInfo();
                }
                function parsePathInfo() {
                    var primaryMenu = UserContextService.PrimaryMenu();
                    for (var k in $state.$current.includes) {
                        if (!k || k == "app") {
                            continue;
                        }
                        curState.push(k);
                    }
                    secondaryMenu = UserContextService.SecondaryMenu(curState[0].substring(4));
                    for (var i = 0, length = primaryMenu.length; i < length; i++) {
                        var item = primaryMenu[i];
                        if (item.State == curState[0]) {
                            scope.pathInfo.push(item.Name);
                            foreachSecMenu();
                            break;
                        }
                    }
                }

                function foreachSecMenu() {
                    if (secondaryMenu.length == 0) {
                        return;
                    }
                    for (var i = 0, length = secondaryMenu.length; i < length; i++) {
                        var item = secondaryMenu[i];
                        var leng = item.Children.length;
                        if (leng == 0) {
                            continue;
                        }
                        for (var a = 0; a < leng; a++) {
                            if (item.Children[a].State == curState[1]) {
                                scope.pathInfo.push(item.Name);
                                scope.pathInfo.push(item.Children[a].Name);
                                break;
                            }
                        }
                    }
                }

                var template = "<div class='path'><i class='ec ec-map'></i>" +
                    "<span ng-repeat='path in pathInfo track by $index'><i ng-if='!$first' class='m-l-xs m-r-xs'>&gt;</i>{{path}}</span></div>";
                var formTemplate = angular.element(template);
                $compile(formTemplate)(scope);
                element.append(formTemplate);
            }
        };
    }])
    //聚焦移除，失交显示
    .directive("ecFocus", function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.focused = false;
                element.bind('focus', function (evt) {
                    scope.$apply(function () {
                        ctrl.focused = true;
                    });
                }).bind('blur', function () {
                    scope.$apply(function () {
                        ctrl.focused = false;
                    });
                });
            }
        };
    })
    //Url验证
    .directive("ecUrl", function () {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }
                var pattern = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_#-](\?)?)*)*$/i;
                ctrl.$error.url = false;
                element.on("blur", function (event) {
                    scope.$apply(function () {
                        if (!!ctrl.$modelValue && !pattern.test(ctrl.$modelValue)) {
                            ctrl.$setValidity("url", false);
                        } else {
                            ctrl.$setValidity("url", true);
                        }
                    });
                });
                ctrl.$formatters.unshift(function (value) {
                    if (value === "") {
                        ctrl.$setValidity("url", true);
                    }
                    return value;
                });
            }
        };
    })

    //手机号验证
    .directive("ecPhone", function () {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }
                var pattern = /^1\d{10}$/;
                if (!angular.isDefined(ctrl.$error.phone)) {
                    ctrl.$error.phone = false;
                }
                element.on("blur", function (event) {
                    scope.$apply(function () {
                        if (!!ctrl.$modelValue && !pattern.test(ctrl.$modelValue)) {
                            ctrl.$setValidity("phone", false);
                        } else {
                            ctrl.$setValidity("phone", true);
                        }
                    });
                });

                ctrl.$formatters.unshift(function (value) {
                    if (!value) {
                        ctrl.$setValidity("phone", true);
                        return value;
                    }
                    if (!pattern.test(value)) {
                        ctrl.$setValidity("phone", false);
                    } else {
                        ctrl.$setValidity("phone", true);
                    }
                    return value;
                });
            }
        };
    })
    //电话号码验证
    //验证连续数字
    .directive("ecSeialNumber", function () {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }
                ctrl.$setValidity("seialNumber", true);
                element.on("blur", function (event) {
                    scope.$apply(function () {
                        ctrl.$setValidity("seialNumber", true);
                        if (isNaN(ctrl.$modelValue)) {
                            return;
                        }
                        var tempArray = ctrl.$modelValue.split("");
                        var validity = true;
                        var firstDiffer = tempArray[0] - tempArray[1];
                        var abFirstDiffer = Math.abs(firstDiffer);
                        if (abFirstDiffer != 1) {
                            ctrl.$setValidity("seialNumber", true);
                            return;
                        }
                        for (var i = 1, leng = tempArray.length - 1; i < leng; i++) {
                            var differ = tempArray[i] - tempArray[i + 1];
                            if (differ == firstDiffer) {
                                validity = false;
                                continue;
                            } else {
                                validity = true;
                                break;
                            }
                        }
                        ctrl.$setValidity("seialNumber", validity);
                    });
                });
            }
        };
    })
    //验证相同数字
    .directive("ecSameNumber", function () {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }
                var pattern = /^(\d)\1{0,}$/;
                ctrl.$setValidity("sameNumber", true);
                element.on("blur", function (event) {
                    scope.$apply(function () {
                        ctrl.$setValidity("sameNumber", true);
                        if (isNaN(ctrl.$modelValue)) {
                            return;
                        }
                        if (ctrl.$modelValue.length <= 1) {
                            return;
                        }
                        if (!!ctrl.$modelValue && !pattern.test(ctrl.$modelValue)) {
                            ctrl.$setValidity("sameNumber", true);
                        } else {
                            ctrl.$setValidity("sameNumber", false);
                        }
                    });
                });
            }
        };
    })
    //自定义正则验证
    .directive("ecPattern", function () {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }
                var patternString = angular.isDefined(attrs.pattern) ? attrs.pattern : "^[A-Za-z0-9]*$";
                var pattern = new RegExp(patternString);
                ctrl.$setValidity("patternError", true);
                element.on("blur", function (event) {
                    scope.$apply(function () {
                        if (!!ctrl.$modelValue && !pattern.test(ctrl.$modelValue)) {
                            ctrl.$setValidity("patternError", false);
                        } else {
                            ctrl.$setValidity("patternError", true);
                        }
                    })
                });
            }
        };
    })
    //身份证验证
    .directive("ecIdNo", function () {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }
                ctrl.$error.idNo = false;
                element.on("blur", function (event) {
                    scope.$apply(function () {
                        if (!!ctrl.$modelValue && !validateIdNo(ctrl.$modelValue)) {
                            ctrl.$setValidity("idNo", false);
                        } else {
                            ctrl.$setValidity("idNo", true);
                        }
                    });
                });
                // 验证身份证号码
                function validateIdNo(idCard) {
                    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
                    var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
                    idCard = trim(idCard.replace(/ /g, ""));//去掉字符串头尾空格

                    if (idCard.length == 15) {
                        //进行15位身份证的验证
                        return isValidityBrithBy15IdCard(idCard);
                    } else if (idCard.length == 18) {
                        var a_idCard = idCard.split("");// 得到身份证数组
                        //进行18位身份证的基本验证和第18位的验证
                        return (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard));
                    } else {
                        return false;
                    }

                    function isTrueValidateCodeBy18IdCard(a_idCard) {
                        var sum = 0;// 声明加权求和变量
                        if (a_idCard[17].toLowerCase() == 'x') {
                            a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
                        }
                        for (var i = 0; i < 17; i++) {
                            sum += Wi[i] * a_idCard[i];// 加权求和
                        }
                        var valCodePosition = sum % 11;// 得到验证码所位置
                        return (a_idCard[17] == ValideCode[valCodePosition]);
                    }

                    function isValidityBrithBy18IdCard(idCard18) {
                        var year = idCard18.substring(6, 10);
                        var month = idCard18.substring(10, 12);
                        var day = idCard18.substring(12, 14);
                        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
                        // 这里用getFullYear()获取年份，避免千年虫问题
                        return !(temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day));
                    }

                    function isValidityBrithBy15IdCard(idCard15) {
                        var pattern = /^\d{15}$/;
                        return pattern.test(idCard15);
                    }

                    //去掉字符串头尾空格
                    function trim(str) {
                        return str.replace(/(^\s*)|(\s*$)/g, "");
                    }
                }
            }
        };
    })
    //验证同级是否有同名
    .directive("ecCheckSame", function ($filter) {
        return {
            restrict: "A",
            require: '?ngModel',
            scope: {
                ecNameList: "="
            },
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }
                element.on("blur", function (event) {
                    scope.$apply(function () {
                        if ($filter("contains")(scope.ecNameList, ctrl.$modelValue)) {
                            ctrl.$setValidity("same", false);
                        } else {
                            ctrl.$setValidity("same", true);
                        }
                    });
                });
            }
        };
    })
    .directive("ecBarChart", ['$parse', function ($parse) {
        return {
            restrict: "A",
            scope: {
                chartTheme: "=",
                chartTitle: "=",
                chartAxis: "="
            },
            link: function (scope, elements, attrs) {
                var curEle = elements[0];
                var markPoint = angular.isDefined(attrs.markPoint) ? scope.$parent.$eval(attrs.markPoint) : "false";
                var markLine = angular.isDefined(attrs.markLine) ? scope.$parent.$eval(attrs.markLine) : "false";
                var barChart = null;
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        right: 'right',
                        top: "middle",
                        align: "left",
                        data: ['总金额']
                    },
                    grid: {
                        left: '0',
                        right: '25%',
                        bottom: '3%',
                        top: '10%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            name: '',
                            type: 'category',
                            boundaryGap: true,
                            data: []
                        }
                    ],
                    yAxis: [
                        {
                            name: '商户(户)',
                            nameGap: 10,
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '销量',
                            type: 'bar',
                            barWidth : 30,
                            data: [5, 20, 36, 10, 10, 20]
                        }
                    ]
                };
                createEchartInstance();
                scope.$watch("chartAxis", function (value, oldValue) {
                    if (oldValue !== value) {
                        updateEchartUI();
                    }
                }, true);
                scope.$watch("chartTheme", function (value, oldValue) {
                    if (oldValue !== value) {
                        createEchartInstance();
                    }
                }, true);

                function createEchartInstance() {
                    barChart = echarts.init(curEle, scope.chartTheme);
                    updateOptionData();
                    barChart.setOption(option);
                }

                function updateOptionData() {
                    option.xAxis[0].name = "";
                    if (!!scope.chartAxis.unit) {
                        option.xAxis[0].name = scope.chartAxis.unit;
                    }
                    option.xAxis[0].data = scope.chartAxis.xData;
                    for (var i = 0; i < scope.chartAxis.yData.length; i++) {
                        option.series[i].name = scope.chartAxis.yData[i].name;
                        option.series[i].data = scope.chartAxis.yData[i].value;
                    }

                    if (!!scope.chartTitle) {
                        option.title.text = scope.chartTitle;
                    }
                    if (!!scope.chartAxis.legendName) {
                        option.legend.data = scope.chartAxis.legendName;
                    }
                    if (markPoint == "true") {
                        option.series[0].markPoint = {
                            data: [
                                {type: "max", name: "最大值"},
                                {type: "min", name: "最小值"}
                            ]
                        };
                    } else {
                        option.series[0].markPoint = {};
                    }
                    if (markLine == "true") {
                        option.series[0].markLine = {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    } else {
                        option.series[0].markLine = {};
                    }
                }

                function updateEchartUI() {
                    if (barChart) {
                        barChart.clear();
                        updateOptionData();
                        barChart.setOption(option);
                    }
                }
            }
        }
    }])
    .controller("DepartmentSelectorCtrl", ["$scope", "$attrs", "ecHttp", "ecWidget", function ($scope, $attrs, ecHttp, ecWidget) {
        $scope.enablePopup = false;
        $scope.activeFlag = [true, false, false];
        $scope.firstClassList = [];
        $scope.secondClassList = [];
        $scope.thirdClassList = [];
        $scope.tabObj = [];
        $scope.upPosition = angular.isDefined($attrs.popupPosition) ? ($attrs.popupPosition == 'up') : false;

        function getDealerClassList(id) {
            return ecHttp.Get("Department/Children", {Id: id}).then(function (data) {
                if (data.Code !== 0) {
                    ecWidget.ShowMessage(data.Message);
                    return;
                }
                return data.Value;
            });
        }

        $scope.toggleDropDown = function () {
            $scope.enablePopup = !$scope.enablePopup;
            if ($scope.enablePopup) {
                getDealerClassList("0").then(function (data) {
                    if (!!data) {
                        $scope.firstClassList = data;
                    }
                });
            }
        };

        $scope.changeTab = function (tab) {
            for (var i = 0; i < $scope.activeFlag.length; i++) {
                $scope.activeFlag[i] = false;
            }
            $scope.activeFlag[tab] = true;
        };

        $scope.selectClassItem = function (rank, index) {
            switch (rank) {
                case 1:
                    $scope.tabObj = [];
                    $scope.tabObj[0] = $scope.firstClassList[index];
                    $scope.secondClassList = [];
                    $scope.thirdClassList = [];
                    getDealerClassList($scope.firstClassList[index].Id).then(function (data) {
                        if (!!data) {
                            $scope.secondClassList = data;
                            if ($scope.secondClassList.length > 0) {
                                $scope.changeTab(1);
                            }
                        }
                    });

                    break;
                case 2:
                    $scope.tabObj[1] = $scope.secondClassList[index];
                    getDealerClassList($scope.secondClassList[index].Id).then(function (data) {
                        if (!!data) {
                            $scope.thirdClassList = data;
                            if ($scope.thirdClassList.length > 0) {
                                $scope.changeTab(2);
                            }
                        }
                    });
                    break;
                case 3:
                    $scope.tabObj[2] = $scope.thirdClassList[index];
                    break;
                default:
                    break;
            }
        };

        $scope.cancel = function () {
            closePopup();
        };
        $scope.ok = function () {
            var lastIndex = $scope.tabObj.length - 1;
            if (lastIndex >= 0) {
                $scope.selectedObj.DepartmentName = $scope.tabObj[lastIndex].DepartmentName;
                $scope.selectedObj.Id = $scope.tabObj[lastIndex].Id;
            }
            closePopup();
        };

        function closePopup() {
            $scope.enablePopup = false;
        }
    }])
    .directive("ecDepartmentSelector", [function () {
        return {
            restrict: "EA",
            replace: "true",
            scope: {
                selectedObj: "=ngModel"
            },
            controller: 'DepartmentSelectorCtrl',
            templateUrl: "js/directive/tpl/departmentSelector.html"
        };
    }])
    .directive("placeholder", function ($timeout, $window) {
        var doc = $window.document,
            isInputSupported = 'placeholder' in doc.createElement('input'),
            isTextareaSupported = 'placeholder' in doc.createElement('textarea');
        return {
            require: "^ngModel",
            restrict: 'A',
            link: function (scope, element, attrs, ctrls) {
                //检查是否支持原生placeholder
                if (isInputSupported && isTextareaSupported) {
                    return;
                }
                if (attrs.type === 'password') {
                    // Placeholder obscured in older browsers,
                    // so there's no point adding to password.
                    return;
                }
                var insert = function () {
                    element.val(attrs.placeholder);
                    element.addClass("placeholder");
                };
                if (!ctrls) {
                    return;
                }
                scope.$watch(
                    function () {
                        return ctrls.$modelValue;
                    },
                    function (value) {
                        if (angular.isUndefined(value) || value === "") {
                            insert();
                        }
                    });
                /*scope.$watch(
                 function(){return ctrls.$viewValue},
                 function(value){
                 if(angular.isUndefined(value) || value == ""){
                 insert();
                 }
                 });*/
                element.bind('blur', function () {
                    if (element.val() === '')
                        insert();
                });
                element.bind('focus', function () {
                    if (element.val() === attrs.placeholder)
                        element.val('');
                    element.removeClass("placeholder");
                });
                //初始化
                $timeout(function () {
                    if (element.val() === '') {
                        insert();
                    }
                });
            }
        };
    });

