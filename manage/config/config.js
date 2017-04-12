
;(function(window,angular){
    'use strict';
    window.AppData.config = {
        "baseUrl":{
            "Site": "http://192.168.0.6:9100/site/",
            "Mall": "http://192.168.0.6:9100/",
            "Merchant": "http://192.168.0.6:9100/Merchant/",
            "Image": "http://192.168.0.6:9100/site/Image/Read/",
            "Upload": "http://192.168.0.6:9100/site/Image/UploadImg/"
        },
        "flag":{
            "debugEnabled":true,
            "isTestAPI":false
        },
        "otherData":{}
    };
})(window,window.angular);
