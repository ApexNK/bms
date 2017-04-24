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
            $scope.memberTypes = [{id:0, name:"劣后级"},{id:1,name:"优先级"}];

            var currentMember = {};
            var currentIndex = 0;

            $scope.addMember = function () {
                $state.go("app.business.add");
            };
            
            $scope.pageChange = function () {
                getMemberList();
            };
            
            $scope.showMemberDetail = function (index) {
                $state.go("app.business.list.memberDetail");
            };
            $scope.showMemberDetail = setMemberDecorator($scope.showMemberDetail);
            
            $scope.editMember = function (index) {
                $state.go("app.business.list.modifyMember");
            };
            $scope.editMember = setMemberDecorator($scope.editMember);
            
            $scope.deleteMember = function (index) {
                ecWidget.ShowMessage("确定要删除这个会员吗",MESG_TYPE.Ask).then(function (data) {
                    console.info(data);
                    if(!data){
                        return;
                    }
                    ecHttp.Post("member/remove?id="+currentMember.id).then(function (data) {
                        if(data.code !== 0){
                            ecWidget.ShowMessage(data.message);
                            return;
                        }
                        $scope.memberList.splice(currentIndex,1);
                        currentIndex = -1;
                    })
                });
            };
            $scope.deleteMember = setMemberDecorator($scope.deleteMember);

            $scope.getCurrentMemberData =  function () {
                console.info("get current Member");
                return currentMember;
            };

            function setMemberDecorator(fn) {
                return function (args) {
                    setCurrentMember(args);
                    fn(args);
                };
            }
            function setCurrentMember(index) {
                console.info("current index is " + index);
                currentIndex = index;
                currentMember = angular.copy($scope.memberList[index]);
            }
            $scope.$on($state.current.name, function () {
                $scope.viewFlag.showChild = false;
            });

            $scope.$on("showListContent", function (event, showList) {
                $scope.viewFlag.showChild = !showList;
            });

            function getMemberList() {
                var param = {
                    page: $scope.pageInfo.CurPage || 1,
                    size: $scope.pageInfo.PageSize || 10
                };
                var request = "member/list";
                var urlParam = "";
                for(var key in param) {
                    urlParam += key;
                    urlParam += "=";
                    urlParam += param[key];
                    urlParam += "&";
                }
                if(urlParam !== "") {
                    request += "?";
                    request += urlParam;
                }
                ecHttp.Post(request).then(function (data) {
                    if(data.code !== 0) {
                        ecWidget.ShowMessage(data.message);
                        return;
                    }
                    $scope.memberList = data.value.content;
                })
            }

            $scope.$on("updateCurrentMember", function(event,member){
                $scope.memberList[currentIndex] = angular.copy(member);
            });
            (function () {
                getMemberList();
            })();
        }])
        .controller("AddBusinessCtrl", ['$scope', 'ecHttp', 'ecWidget', '$state', '$stateParams', 'UserContextService', function ($scope, ecHttp, ecWidget, $state, $stateParams, UserContextService) {
            $scope.memberTypes = [{id:0, name:"劣后级"},{id:1,name:"优先级"}];
            $scope.member = {};
            $scope.pDateCtrl = {IsDateStart: false, IsDateEnd: false};
            $scope.rDateCtrl = {IsDateStart: false, IsDateEnd: false};
            $scope.tDateCtrl = {IsDateStart: false, IsDateEnd: false};

            var addedMember = {
                init: function () {
                    $scope.member = {grade: 0};
                },
                saveMember: function () {
                    saveMemberInfo();
                }
            };
            var modifiedMember = {
                init: function () {
                    $scope.member = $scope.$parent.getCurrentMemberData();
                    if(!$scope.member) {
                        $state.go("app.business.list");
                        return;
                    }
                    UserContextService.SetParentViewStatus($scope);
                },
                saveMember: function () {
                    saveMemberInfo(true);
                }
            };
            var currentMember = ($state.current.name == "app.business.list.modifyMember") ? modifiedMember : addedMember;
            
            $scope.addMember = function (isValid) {
                currentMember.saveMember();
            };
            
            $scope.checkMemberLoginName = function () {
                if(!$scope.member.loginName) {
                    return;
                }
                ecHttp.Get("member/validateName",{value:$scope.member.loginName}).then(function (data) {
                    if(code !== 0) {
                        ecWidget.ShowMessage("账号" + $scope.member.loginName + "已经存在，请重新设置");
                        $scope.member.loginName = "";
                    }
                })
            };

            function saveMemberInfo(isEdited) {
                var param = {
                    name:"",
                    loginName: "",
                    loginPassword: "",
                    grade: 0,
                    quantity: 0.0, //买入数量
                    cost: 0.0,//购买成本
                    purchaseDate:"",//买入日期
                    currentPrice: 0, //最新价格
                    selloutDate: "", //     转让日期，
                    buybackDate: "",//        回购日期，
                    buybackPrice: 0.0,//        最低回购价，
                    annualRate: "", //        年收益率，
                    score: 0, //        积分，
                    bonus: 0.0, //        业绩奖励，
                    withdraw: 0.0 //        盈亏提现
                };
                ecHttp.Post("member/save",$scope.member).then(function (data) {
                    if(data.code !== 0) {
                        ecWidget.ShowMessage(data.message);
                        return;
                    }
                    if (isEdited ){
                        $scope.$emit("updateCurrentMember", data.value);
                        window.history.go(-1);
                    }else {
                        $state.go("app.business.list");
                    }

                });
            }

            (function () {
                currentMember.init();
            })();
        }])
        .controller("BusinessDetailCtrl", ['$scope', 'ecHttp', 'ecWidget', '$state', 'UserContextService',function ($scope, ecHttp, ecWidget, $state, UserContextService) {

            $scope.goBack = function () {
                window.history.go(-1);
            };

            function getCurrentMemberInfo() {
                var currentMember = $scope.$parent.getCurrentMemberData();
                ecHttp.Get("member/show",{id:currentMember.id}).then(function (data) {
                    if(data.code !== 0){
                        ecWidget.ShowMessage(data.message);
                        return;
                    }
                });
                debugger;
            }

            (function () {
                UserContextService.SetParentViewStatus($scope);
                getCurrentMemberInfo();
            })();
        }])
})(window, window.angular);