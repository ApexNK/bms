(function (window, angular) {
    'use strict';
    angular.module("Controller.Business.Manage", [])
        .controller("BusinessMainCtrl", ['$state', 'UserContextService', function ($state, UserContextService) {
            var MenuItems = UserContextService.SecondaryMenu("business");
            if (!!MenuItems && MenuItems[0].Children && MenuItems[0].Children.length > 0) {
                $state.go(MenuItems[0].Children[0].State);
            }
        }])
        .controller("BusinessListCtrl", ['$scope', 'ecHttp', 'ecWidget', '$state', "MESG_TYPE", function ($scope, ecHttp, ecWidget, $state, MESG_TYPE) {
        }])
        .controller("AddBusinessCtrl", ['$scope', 'ecHttp', 'ecWidget', '$state', '$stateParams', 'UserContextService', function ($scope, ecHttp, ecWidget, $state, $stateParams, UserContextService) {
            $scope.memberTypes = [{id:0, name:"劣后级"},{id:1,name:"优先级"}];
            $scope.member = {
                name:"",
                type: 0,
                purchaseAmount: 10000,
                cost: 5,
                purchaseDate: "2017-4-1",
                lastestPrice: 4,
                transferDate: "",
                buyBackDate: "2020-1-1",
                buyBackPrice: 8,
                annualYield: 0.12
            };
            $scope.pDateCtrl = {IsDateStart: false, IsDateEnd: false};
            $scope.rDateCtrl = {IsDateStart: false, IsDateEnd: false};
            $scope.addMember = function (isValid) {
                
            }
        }])
        .controller("OwnMerchantCtrl", ["$scope", "ecHttp", "ecWidget", "$state", function ($scope, ecHttp, ecWidget) {
            $scope.pageInfo = {
                AllChecked: false,
                CurPage: 1,
                PageSize: 10,
                TotalPages: 1,
                TotalRows: 0
            };
            $scope.SearchControl = {
                IsAdvance: false,
                CompanyName: ""
            };
            $scope.businessList = [];
            $scope.activeFlag = [true, false];
            initDate();
            function initDate() {
                var param = angular.copy($scope.SearchControl);
                delete  param.IsAdvance;
                param.CurPage = $scope.pageInfo.CurPage;
                param.PageSize = $scope.pageInfo.PageSize;
                ecHttp.Get("Merchant/OwnMerchantList", param).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    $scope.businessList = data.Value.data;
                    $scope.pageInfo.TotalRows = data.Value.totalRows;
                    $scope.pageInfo.TotalPages = Math.ceil($scope.pageInfo.TotalRows / $scope.pageInfo.PageSize);
                })
            }

            $scope.search = function (curPage) {
                $scope.pageInfo.CurPage = curPage || $scope.pageInfo.CurPage;
                initDate();
            };
            $scope.collapse = function (index) {
                angular.forEach($scope.companyList, function (item) {
                    item.isCollapsed = true;
                });
                $scope.selectRow = index;
                $scope.companyList[index].isCollapsed = false;
            };
            //操作-搜索-清空
            $scope.clear = function (index) {
                angular.forEach($scope.SearchControl, function (item, key) {
                    if (key != "IsAdvance") {
                        $scope.SearchControl[key] = "";
                    }
                })
            };
            $scope.$watch("SearchControl", function (data) {
                $scope.fileParam = angular.copy($scope.SearchControl);
            }, true);

            $scope.changeTab = function (index) {
                $scope.activeFlag = [false, false];
                $scope.activeFlag[index] = true;
            };


            $scope.showBusinessDetail = function (index) {
                $scope.business = {
                    IsShowText: true
                };
                $scope.changeTab(1);
                getBusinessDetail(index);
            };

            function getBusinessDetail(index) {
                $scope.business = $scope.businessList[index];
            }
        }])
})(window, window.angular);