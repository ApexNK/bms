/**
 * Created by juyong.li on 2015/11/9.
 */
angular.module("Filter.All", [])
    .filter("ImgUrl", ['ecHttp', function (ecHttp) {

        return function (url, sizeParam) {
            if (!url) {
                return "assets/img/default.jpg";
            }
            return ecHttp.ImgUrl(url, sizeParam);
        };

    }])
    .filter("ApiUrl", ['ecConfig', function (ecConfig) {
        return function (url) {
            var config = ecConfig.getConfig();
            if (!config) {
                return url;
            }
            return config.baseUrl.Site + url;
        };
    }])
    .filter("EcDate", ['$filter', function ($filter) {
        return function (dt, fmt) {
            if (!dt) {
                return "";
            }
            var jsDt = new Date(parseInt(dt.replace("/Date(", "").replace(")/", ""), 10));
            if (!fmt) {
                fmt = "yyyy-MM-dd";
            }
            var result = $filter("date")(jsDt, fmt);
            return result;
        };
    }])
    .filter("EcDateTime", ['$filter', function ($filter) {
        return function (dt, fmt) {
            if (!dt) {
                return "";
            }
            var jsDt = new Date(parseInt(dt.replace("/Date(", "").replace(")/", ""), 10));
            if (!fmt) {
                fmt = "yyyy-MM-dd HH:mm";
            }
            var result = $filter("date")(jsDt, fmt);
            return result;
        };
    }])
    .filter('EcTrustHtml', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])
;
