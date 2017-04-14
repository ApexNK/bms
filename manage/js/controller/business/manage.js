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
            $scope.viewFlag = {
                showChild:false
            };
            $scope.searchContent = { memberName:""};
            $scope.memberList = [];
            $scope.pageInfo = {
                CurPage: 1,
                TotalPages: 1,
                TotalRows: 0,
                PageSize: 10
            };
            var memberInfo = {
                accountId: "900001",
                name: "张董事长",
                type:"优先级",
                purchaseAmount: 100000,
                cost: 12,
                totalAmount: 1200000,
                currentAmount: 1330083,
                withdraw: 130083,
                buyBackDate: "2017-12-30"
            };
            $scope.memberList.push(memberInfo);
            
            $scope.addMember = function () {
                $state.go("app.business.add");
            };
            
            $scope.search = function () {
                
            };
            
            $scope.showMemberDetail = function (index) {
                
            };
            
            $scope.editMember = function (index) {
                
            };
            
            $scope.deleteMember = function (index) {
                ecWidget.ShowMessage("确定要删除****",MESG_TYPE.Ask).then(function (data) {
                    console.info(data);
                });
            };

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
            $scope.tDateCtrl = {IsDateStart: false, IsDateEnd: false};
            $scope.addMember = function (isValid) {
                
            }
        }])
})(window, window.angular);