/**
 * Created by juyong.li on 2015/11/9.
 */
(function (window, angular) {
    'use strict';
    angular.module("Controller.Workboard", [])
        .controller("WorkboardCtrl", ["$scope", "UserContextService", "ecHttp", "ecWidget",
            function ($scope, UserContextService, ecHttp, ecWidget) {
                $scope.showNoticeList = false;
                $scope.noticeList = [];
                $scope.noticeShowList = [];
                $scope.noticeDetail = {};
                $scope.pageInfo = {
                    CurPage: 1,
                    TotalPages: 1,
                    TotalRows: 0,
                    PageSize: 10
                };
                $scope.personalInfo = {};
                ecHttp.Get("Staff/UserInfo").then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    $scope.personalInfo = data.Value;
                    $scope.tempInfo = angular.copy($scope.personalInfo);
                });
                $scope.goBack = function(){
                    $scope.showNoticeDetail = false;
                };
                $scope.showDetail = function (index) {
                    var item = $scope.noticeList[index];
                    ecHttp.Get("MallNotice/GetNoticeDetail", {noticeId: item.NoticeId}).then(function (data) {
                        if (data.Code != 0) {
                            ecWidget.ShowMessage(data);
                            return;
                        }
                        $scope.noticeDetail = data.Value;
                        $scope.AttachFiles = data.Value.FileList;
                        $scope.showNoticeDetail = true;
                    });
                };
                $scope.downloadUrl = ecHttp.RequestUrl("File/Read");
                $scope.Blogroll = "0";
                $scope.skipToBlogroll = function () {
                    if ($scope.Blogroll == 1) {
                        window.open("http://www.baidu.com");
                    }
                    if ($scope.Blogroll == 2) {
                        window.open("http://www.baidu.com");
                    }
                    if ($scope.Blogroll == 3) {
                        window.open("http://www.baidu.com");
                    }
                };

                $scope.menu = angular.copy(window.AppData.primaryMenu).splice(1);

                function inintData() {
                    for (var i = 0; i < $scope.menu.length; i++) {
                        $scope.menu[i].Children = UserContextService.SecondaryMenu($scope.menu[i].State.replace("app.", ""))
                    }
                }
                inintData();

                $scope.shortCutA = [
                    {
                        Code: "000101",
                        PrimaryCode: "00",
                        SecondCode: "0001",
                        SecondType: "inner"
                    },
                    {
                        Code: "010002",
                        PrimaryCode: "01",
                        SecondCode: "0100",
                        SecondType: "shop"
                    },
                    {
                        Code: "020100",
                        PrimaryCode: "02",
                        SecondCode: "0201",
                        SecondType: "goods"
                    },
                    {
                        Code: "040002",
                        PrimaryCode: "04",
                        SecondCode: "0400",
                        SecondType: "mall"
                    },
                    {
                        Code: "050100",
                        PrimaryCode: "05",
                        SecondCode: "0501",
                        SecondType: "mobile"
                    },
                    {
                        Code: "060002",
                        PrimaryCode: "06",
                        SecondCode: "0600",
                        SecondType: "info"
                    },
                    {
                        Code: "070000",
                        PrimaryCode: "07",
                        SecondCode: "0700",
                        SecondType: "tool"
                    }
                ];
                $scope.shortCut = angular.copy($scope.shortCutA);

                getNoticeList();
                function getNoticeList() {
                    var param = {};
                    param.CurPage = $scope.pageInfo.CurPage;
                    param.PageSize = $scope.pageInfo.PageSize;
                    ecHttp.Get("MallNotice/GetAllNotice", param).then(function (data) {
                        if (data.Code != 0) {
                            ecWidget.ShowMessage(data);
                            return;
                        }
                        if (data.Value.TotalRows > 0) {
                            $scope.pageInfo.TotalRows = data.Value.TotalRows;
                            $scope.pageInfo.TotalPages = Math.ceil($scope.pageInfo.TotalRows / $scope.pageInfo.PageSize);
                        }
                        $scope.noticeList = data.Value.List;
                        getNoticeShow($scope.noticeList);
                    })
                }

                $scope.getNoticeDetail = function (index) {
                     var item = $scope.noticeList[index];
                     $scope.noticeDetail.NoticeId = item.NoticeId;
                     $scope.noticeDetail.Title = item.Title;
                     ecHttp.Get("MallNotice/GetNoticeDetail", {noticeId: item.NoticeId}).then(function (data) {
                     if (data.Code != 0) {
                     ecWidget.ShowMessage(data);
                     return;
                     }
                     $scope.noticeDetail.Content = data.Value.Detail;
                     $scope.noticeDetail.AttachFiles = data.Value.FileList;
                     });
                 };

                function getNoticeShow(list){
                    if($scope.pageInfo.CurPage !== 1){
                        return;
                    }
                    var leng = list.length;
                    if(leng<5){
                        $scope.noticeShowList = list;
                    }else{
                        $scope.noticeShowList = list.slice(0,4);
                    }
                }

                function  initFunctionList(){
                    for (var i = 0; i < $scope.shortCut.length; i++) {
                        var pId = $scope.shortCut[i].PrimaryCode;
                        var sId = $scope.shortCut[i].SecondCode;
                        var id = $scope.shortCut[i].Code;
                        for (var j = 0; j < $scope.menu.length; j++) {

                            $scope.menu[j].C = (j != 0);
                            if ($scope.menu[j].Code != pId) {
                                continue;
                            }

                            var secondMenus = $scope.menu[j].Children;
                            for (var k = 0; k < secondMenus.length; k++) {
                                var item = secondMenus[k];
                                if (item.Code != sId) {
                                    continue;
                                }
                                $scope.shortCut[i].PName = item.Name;
                                var thirdMenus = item.Children;
                                for (var l = 0; l < thirdMenus.length; l++) {
                                    var item2 = thirdMenus[l];
                                    if (item2.Code == id) {
                                        $scope.shortCut[i].Name = item2.Name;
                                        $scope.shortCut[i].State = item2.State;
                                        $scope.shortCut[i].ShortCutIcon = item2.ShortCutIcon;
                                        $scope.shortCut[i].BgColor = item2.BgColor;
                                        item2.Checked = true;
                                    }
                                }
                            }

                        }
                    }
                }
                initFunctionList();

                $scope.changeState = function(){
                    $scope.showNoticeList = true;
                };

                $scope.updateList = function (curPage) {
                    $scope.pageInfo.CurPage = curPage || $scope.pageInfo.CurPage;
                    getNoticeList();
                };

                $scope.setShortCut = {IsShow: false};
                $scope.set = function () {
                    $scope.setShortCut.IsShow = true;
                };
                $scope.saveSetShortCut = function (){
                    $scope.setShortCut.IsShow = false;
                };
                $scope.back = function (){
                    $scope.setShortCut.IsShow = false;
                };
                $scope.merchantDate = {
                    unit: "",
                    xData: ["自注册","管理录入"],
                    yData: [
                        {
                            name: '商户数量',
                            value: ["1","2"]
                        }
                    ],
                    legendName: ['商户数量']
                };
            }])
    ;
})(window, window.angular);