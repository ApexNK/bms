
(function (window, angular) {
    'use strict';
    angular.module("Directive.Validation", [])
        .directive("ecNumberInput", [function () {
            return {
                restrict: "A",
                require: "?ngModel",
                scope: {
                    start: "=?start",
                    min: "=?min",
                    max: "=?max",
                    allowEmpty: "=?allowEmpty",
                    disableDecimal: "=?disableDecimal",
                    decimalPlaces: "=?decimalPlaces"
                },
                link: function (scope, element, attrs, ctrl) {
                    var ngModelCtrl = ctrl;
                    if (!ngModelCtrl) {
                        return;
                    }
                    if (!scope.min) {
                        scope.min = 0;
                    }
                    if (angular.isUndefined(scope.max)) {
                        scope.max = 1000000000000;
                    }
                    if (!angular.isDefined(scope.allowEmpty)) {
                        scope.allowEmpty = false;
                    }
                    if (!angular.isDefined(scope.disableDecimal)) {
                        scope.disableDecimal = true;
                    }
                    if (!angular.isDefined(scope.decimalPlaces)) {
                        scope.decimalPlaces = 0;
                    }
                    element.on("blur", function () {
                        if(scope.allowEmpty && ngModelCtrl.$viewValue === "" ){
                            return;
                        }

                        var result = translateStringToNumber(ngModelCtrl.$viewValue);
                        if (result < scope.min) {
                            result = scope.min;
                        }
                        renderView(result);
                    });
                    ngModelCtrl.$parsers.push(function (value) {
                        if (angular.isUndefined(value) && !value) {
                            return value;
                        }
                        if (angular.isNumber(value)) {
                            return value;
                        }
                        var isChanged = false;
                        var regExp = /^\d+\.?\d*$/;
                        if (scope.disableDecimal) {
                            regExp = /^\d+$/;
                        }
                        var valueStr = value.toString();
                        for (var i = valueStr.length; i > 0; i--) {
                            if (!regExp.test(valueStr.substring(0, i))) {
                                valueStr = valueStr.substring(0, i - 1);
                                isChanged = true;
                            } else {
                                break;
                            }
                        }
                        if (valueStr.length == 2) {
                            if (valueStr[0] == "0" && valueStr[1] != ".") {
                                valueStr = valueStr.substring(1, 2);
                                isChanged = true;
                            }
                        }
                        if (!scope.disableDecimal) {
                            var demicalIndex = valueStr.indexOf(".");
                            if ((demicalIndex > -1) && (valueStr.length > demicalIndex + scope.decimalPlaces + 1)) {
                                valueStr = valueStr.substring(0, demicalIndex + scope.decimalPlaces + 1);
                                isChanged = true;
                            }
                        }
                        if (isChanged) {
                            renderView(valueStr);
                        }
                        compareMaxAndMinValue(valueStr);
                        return valueStr;
                    });

                    function translateStringToNumber(value) {
                        if(scope.allowEmpty && value==="" ){
                            return "";
                        }
                        if(value===""){
                            return scope.min;
                        }
                        var result = +parseFloat(value).toFixed(scope.decimalPlaces);
                        return result;
                    }

                    function compareMaxAndMinValue(value) {
                        if(value===""){
                            return;
                        }
                        var numberValue = translateStringToNumber(value);
                        var isChanged = false;
                        if (numberValue > scope.max) {
                            value = scope.max;
                            isChanged = true;
                        }
                        if (isChanged) {
                            renderView(value);
                        }
                    }

                    function renderView(value) {
                        ngModelCtrl.$setViewValue(value);
                        ngModelCtrl.$render();
                    }
                }
            };
        }])
    ;
})(window, window.angular);



