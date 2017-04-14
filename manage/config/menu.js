(function (window, angular) {
    'use strict';
    window.AppData = {};
    window.AppData.platform = "会员管理系统";
    window.AppData.primaryMenu = [
        {
            Name: "会员管理",
            State: "app.business",
            Icon: "ec ec-merchants"
        }
    ];
    window.AppData.secondaryMenu = {};
    window.AppData.secondaryMenu.business = [
        {
            Name: "会员信息",
            Children: [
                {
                    Name: "新增会员信息",
                    State: "app.business.add"
                },
                {
                    Name: "会员信息维护",
                    State: "app.business.list"
                }
            ]
        }
    ];
})(window, window.angular);