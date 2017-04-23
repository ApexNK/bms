
;(function(window,angular){
    'use strict';
    window.AppData.config = {
        "baseUrl":{
            "Site": "http://localhost:9933/",//http://capesonlee.tunnel.2bdata.com/
            "Mall": "http://192.168.0.6:9100/",
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
