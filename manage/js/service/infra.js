(function (window, angular) {
    'use strict';
    var ecModule = angular.module("service.ecModule", ['ajoslin.promise-tracker']);
    ecModule.config(['$httpProvider', function ($httpProvider) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = false;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.responseInterceptors.push('ecResponseInterceptor');

    }]);
    ecModule.factory('ecResponseInterceptor', ['$window', '$filter', '$q', '$injector', 'securityRetryQueue', 'ecConfig', '$timeout',
        function ($window, $filter, $q, $injector, queue, ecConfig,$timeout) {
            return function (promise) {
            // Intercept failed requests
            return promise.then(function (response) {

                if (response.data.Code == 1000005 || response.data.Code == 1000007) {
                    // The request bounced because it was not authorized - add a new request to the retry queue
                    var retryPromise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
                        // We must use $injector to get the $http service to prevent circular dependency
                        return $injector.get('$http')(response.config);
                    });
                    if (queue.getLength() > 1) {
                        return retryPromise;
                    }
               
                    if( $filter("endsWith")(response.config.url,"Account/UserInfo")){
                        $timeout(function(){
                            $window.location.href="index.html";
                        });
                        return $q.reject(response);
                    }
                    $injector.get('ecWidget').ShowLoginModal();//通过手动注入的方式防止循环依赖
                    return retryPromise;
                }
                return response;
            }, function (rejection) {
                $injector.get('ecWidget').ShowMessage(rejection.status + " " + rejection.statusText + ":" + rejection.config.url); ////通过手动注入的方式防止循环依赖
                return $q.reject(rejection);
            });
        };
    }]);
    ecModule.factory("ecConfig", ["$q", "$log", function ($q, $log) {

        var _config;
        var _initConfig = function () {
            _config = window.AppData.config;
        };
        return {
            getConfig: function () {
                return _config;
            },
            initConfig: _initConfig
        };
    }]);

    ecModule.factory("ecHttp", ["$rootScope", "$http", "$q", "ecConfig", "$location", "$state", "promiseTracker", function ($rootScope, $http, $q, ecConfig, $location, $state, promiseTracker) {
        $rootScope.loadingTracker = promiseTracker();
        function _GetRequestUrl(url) {
            var config = ecConfig.getConfig();
            if (!config.flag.isTestAPI) {
                return config.baseUrl.Site + url;
            }
            return "json/" + url + ".json";
        }

        function _Post(url, formData) {
            var deferred = $q.defer();
            var resp = $http.post(_GetRequestUrl(url), formData);
            resp.then(function (data, status, headers, config) {
                    /*todo:*/
                    deferred.resolve(data.data);
                },
                function (data, status, headers, config) {
                    deferred.reject({Code: status, Message: "服务器发生错误"});
                });
            return deferred.promise;
        }

        function _Get(url, param) {
            var deferred = $q.defer();
            var resp = $http.get(_GetRequestUrl(url), {
                params: param
            }).then(function (data, status, headers, config) {
                    deferred.resolve(data.data);
                },
                function (data, status, headers, config) {
                    deferred.reject({Code: data.status, Message: "服务器发生错误"});
                });
            return deferred.promise;
        }

        function _ImgUrl(key, sizeParam) {
            if (angular.isString(key) === false || !key) {
                return "";
            }
            if (key.indexOf("http") != -1 || key.indexOf("asset") != -1) {
                return key;
            }
            if (!!sizeParam) {
                key += "!";
                key += sizeParam;
            }
            return ecConfig.getConfig().baseUrl.Image + key;
        }

        return {
            Post: _Post,
            Get: _Get,
            ImgUrl: _ImgUrl,
            RequestUrl: _GetRequestUrl
        };
    }]);
    ecModule.service("EventBus", [function () {
        var subscriberList = [];

        function _subscribe(evt, fn) {
            for (var i = 0; i < subscriberList.length; ++i) {
                if (subscriberList[i].Event === evt && subscriberList[i].Fn === fn) {
                    return;
                }
            }
            subscriberList.push({Event: evt, Fn: fn});
        }

        function _unsubscribe(evt, fn) {

            for (var i = 0; i < subscriberList.length; ++i) {
                if (subscriberList[i].Event === evt && subscriberList[i].Fn === fn) {
                    break;
                }
            }
            subscriberList.splice(i, 1);

        }

        function _publish(evt, data) {

            for (var i = 0; i < subscriberList.length; ++i) {
                if (subscriberList[i].Event === evt) {
                    subscriberList[i].Fn(data);
                }
            }
        }

        return {
            Subscribe: _subscribe,
            Unsubscribe: _unsubscribe,
            Publish: _publish
        };

    }]);
})(window, window.angular);
