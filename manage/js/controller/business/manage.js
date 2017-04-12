(function (window, angular) {
    'use strict';
    angular.module("Controller.Business.Manage", [])
        .constant("MerChantConstant", {
            RegChannel_ManageAdd: 1,
            RegChannel_SelfReg: 2,
            BusinessScale_Min: 1000,
            BusinessScale_Max: 3000,
            NumberMax: 1000000000000,
            ApplyToSeller: 7
        })
        .constant("AuditChangeType", {
            Not: 0,
            AddCompany: 1,
            UpdateCompany: 2,
            Identification: 3,
            OnLine: 4,
            OffLine: 5,
            RemoveMerchant: 6
        })
        .constant("AuditFunctionType", {
            Not: 0,
            CompanyInfoReview: 4,
            CompanyStatusReview: 5
        })
        .controller("BusinessMainCtrl", ['$state', 'UserContextService', function ($state, UserContextService) {
            var MenuItems = UserContextService.SecondaryMenu("business");
            if (!!MenuItems && MenuItems[0].Children && MenuItems[0].Children.length > 0) {
                $state.go(MenuItems[0].Children[0].State);
            }
        }])
        .controller("BusinessListCtrl", ['$scope', 'ecHttp', 'ecWidget', '$state', "MESG_TYPE", function ($scope, ecHttp, ecWidget, $state, MESG_TYPE) {
            $scope.showInfo = false;
            $scope.businessList = [];
            $scope.operationTypes = [];
            $scope.pageInfo = {
                CurPage: 1,
                TotalPages: 1,
                TotalRows: 0,
                PageSize: 10
            };
            $scope.SearchControl = {
                IsAdvance: false,
                OrgId: "",
                CompanyName: "",
                RegChannel: ""
            };
            $scope.selIndustry = {
                First: "",
                Second: "",
                Third: "",
                AddressName: ""
            };

            function getOperationType() {
                return ecHttp.Get("Public/GetBusinessModel").then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return false;
                    }
                    $scope.operationTypes = data.Value;
                    $scope.operationTypes.unshift({"Id": undefined, "Name": "请选择"});
                })
            }

            function getBusinessList() {
                var param = angular.copy($scope.SearchControl);
                delete  param.IsAdvance;
                param.CurPage = $scope.pageInfo.CurPage;
                param.PageSize = $scope.pageInfo.PageSize;
                ecHttp.Get("Merchant/List", param).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    $scope.businessList = data.Value.data;
                    $scope.pageInfo.TotalRows = data.Value.totalRows;
                    $scope.pageInfo.TotalPages = Math.ceil($scope.pageInfo.TotalRows / $scope.pageInfo.PageSize);
                })
            }

            getBusinessList();
            getOperationType();
            $scope.search = function () {
                getBusinessList();
            };
            $scope.clear = function () {
                angular.forEach($scope.SearchControl, function (item, key) {
                    if (key != "IsAdvance" && key != "RegChannel") {
                        $scope.SearchControl[key] = "";
                    }
                    if (key == "RegChannel") {
                        $scope.SearchControl[key] = "";
                    }
                });
            };
            $scope.addBusiness = function () {
                $state.go("app.business.add");
            };
            $scope.editBusiness = function (index) {
                var data = {
                    Id: $scope.businessList[index].OrgId,
                    type: 'isEdit'
                };
                $state.go("app.business.add", data);
            };
            $scope.lockBusiness = function (index, status) {
                ecWidget.ShowMessage("确认要" + (status ? "下线" : "上线") + "吗？", MESG_TYPE.Ask).then(function () {
                    var param = {};
                    param.OrgId = $scope.businessList[index].OrgId;
                    var url = "Merchant/OnlineAudit";
                    if (status) {
                        url = "Merchant/OfflineAudit";
                    }
                    ecHttp.Post(url, param).then(function (data) {
                        if (data.Code != 0) {
                            ecWidget.ShowMessage(data);
                            return;
                        }
                        $scope.businessList[index].IsLock = status;
                        ecWidget.ShowToaster("success", "操作提示", "操作成功！");
                    })
                })
            };
            $scope.showBusinessDetail = function (index) {
                var item = $scope.businessList[index];
                ecHttp.Get("Merchant/Detail", {OrgId: item.OrgId}).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    $scope.business = data.Value;
                    if (!!$scope.business.BusinessModel) {
                        $scope.business.BusinessModelName = $scope.operationTypes[$scope.business.BusinessModel].Name;
                    }
                    $scope.showInfo = true;
                    getIndustry(data.Value.CompanySortModelList || []);
                    function getIndustry(data) {
                        for (var i = 0; i < data.length; ++i) {
                            if (data[i].Id == '1') {
                                data.splice(i, 1);
                                break;
                            }
                        }
                        $scope.business.EntSortName = "";
                        for (var i = 0, len = data.length; i < len; ++i) {
                            $scope.business.EntSortName += data[len - i - 1].SortName + (i != len - 1 ? "->" : "");
                        }
                    }
                })
            };
            $scope.goBack = function () {
                $scope.business = {};
                $scope.showInfo = false;
            };
            //注销商户
            $scope.logoff = function (index) {
                if (!$scope.businessList[index].IsLock && $scope.businessList[index].IsCompany == 1) {
                    ecWidget.ShowToaster("error", "操作提示", "企业需要下线才能注销");
                    return;
                }
                ecWidget.ShowMessage("确认要注销商户吗？", MESG_TYPE.Ask).then(function (result) {
                    ecHttp.Post("Merchant/Remove", {"OrgId": $scope.businessList[index].OrgId}).then(function (data) {
                        if (data.Code != 0) {
                            ecWidget.ShowMessage(data);
                            return;
                        }
                        ecWidget.ShowToaster("success", "操作提示", "注销成功！");
                        getBusinessList();
                    })
                })
            };
        }])
        .controller("AddBusinessCtrl", ['$scope', 'ecHttp', 'ecWidget', '$state', '$stateParams', 'UserContextService', function ($scope, ecHttp, ecWidget, $state, $stateParams, UserContextService) {
            $scope.business = {};
            $scope.selectedAddress = {
                UserProvince: "",
                UserCity: "",
                UserDistrict: "",
                AddressName: ""
            };
            $scope.submitted = false;
            $scope.isAudit = false;
            $scope.selIndustry = {
                First: "",
                Second: "",
                Third: ""
            };
            $scope.companyTypes = [{Id: 0, Name: "供应链企业"}, {Id: 1, Name: "电子开单企业"}];
            var backUrl = "app.business.list";

            checkIsAdd();
            function checkIsAdd() {
                if ($stateParams.type == 'isAudit') {
                    $scope.isAudit = true;
                    backUrl = 'app.business.applySaler';
                    getApplyInfo($stateParams.Id);
                    UserContextService.SetSecondaryMenuName("business", "app.business.add", "审核商户信息");
                    $scope.showCancel = true;
                    return;
                }
                if (!!$stateParams.Id) {
                    getMerchantInfo($stateParams.Id);
                    UserContextService.SetSecondaryMenuName("business", "app.business.add", "编辑商户信息");
                    $scope.showCancel = true;
                }
            }

            getOperationType();
            function getOperationType() {
                ecHttp.Get("Public/GetBusinessModel").then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    $scope.operationTypes = data.Value;
                    $scope.operationTypes.unshift({"Id": "", "Name": "请选择"});
                })
            }

            function getIndustry(data) {
                if (!!data) {
                    var industry = ["", "", ""];
                    for (var i = 0, len = data.length; i < len; ++i) {
                        industry[i] = data[len - i - 1].Id;
                    }
                    $scope.selIndustry.First = industry[0];
                    $scope.selIndustry.Second = industry[1];
                    $scope.selIndustry.Third = industry[2];
                }
            }

            function getMerchantInfo(Id) {
                ecHttp.Get("Merchant/Detail", {OrgId: Id}).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    $scope.business = data.Value;
                    $scope.business.BusinessModel = !!data.Value.BusinessModel ? data.Value.BusinessModel.toString() : "";
                    $scope.selectedAddress.AddressName = $scope.business.CompanyAreaName;
                    $scope.selectedAddress.UserDistrict = $scope.business.CompanyAreaId;
                    getIndustry(data.Value.CompanySortModelList || []);
                    $scope.$broadcast('refresh', $scope.selectedAddress.UserDistrict);
                })
            }

            function getApplyInfo(Id) {
                ecHttp.Get("ApplySaler/Detail", {OrgId: Id}).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    $scope.business.CompanyName = data.Value.CompanyName;
                    $scope.business.UnifiedSocialCreditcode = data.Value.UnifiedSocialGreditcode;
                    $scope.business.LegalName = data.Value.LegalName;
                    $scope.business.IDCardNo = data.Value.IdCardNo;
                    $scope.business.LinkMan1 = data.Value.LinkMan;
                    $scope.business.LinkManTel1 = data.Value.LinkManTel;
                    $scope.business.CompanyTel = data.Value.CompanyTel;
                    $scope.business.Address = data.Value.Address;
                    $scope.business.Zip = data.Value.Zip;
                    $scope.selectedAddress.AddressName = data.Value.CompanyAreaName;
                    $scope.selectedAddress.UserDistrict = data.Value.CompanyAreaId;
                    $scope.business.BusinessModel = !!data.Value.BusinessModel ? data.Value.BusinessModel.toString() : "";
                    $scope.business.CompanyScale = data.Value.CompanyScale;
                    $scope.business.BusinessLicenceUrl = data.Value.BusinessLicenceUrl;
                    getIndustry(data.Value.CompanySortModelList || []);
                    $scope.$broadcast('refresh', $scope.selectedAddress.UserDistrict);
                })
            }

            function saveBusiness() {
                $scope.business.EntSortId = $scope.selIndustry.Third || $scope.selIndustry.Second || $scope.selIndustry.First || $scope.business.EntSortId;
                $scope.business.OrgId = $stateParams.Id || "";
                $scope.business.CompanyAreaId = $scope.selectedAddress.UserDistrict;
                $scope.business.CompanyAreaName = $scope.selectedAddress.AddressName;
                var url = "Merchant/Edit";
                if (!$stateParams.OrgId) {
                    url = "Merchant/Add";
                }
                if ($scope.isAudit) {
                    url = "ApplySaler/EditMerchantToSupplier";
                }
                ecHttp.Post(url, $scope.business).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    ecWidget.ShowToaster("success", "操作提示", "保存成功！");
                    $state.go(backUrl);
                })
            }

            $scope.audit = function (isValid) {
                if (!isValid) {
                    $scope.submitted = true;
                    return;
                }
                saveBusiness();
            };
            $scope.addBusiness = function (valid) {
                if (!valid) {
                    $scope.submitted = true;
                    return;
                }
                saveBusiness();
            };
            $scope.setScepter = function (TempletId) {
                ecWidget.SelectBusinessRoleTemplate(TempletId).then(function (result) {
                    $scope.business.ModuleTempletId = result.Id;
                    $scope.business.ModuleTempletName = result.TemplateName;
                })
            };
            $scope.cancel = function () {
                $state.go(backUrl);
            };
            $scope.$on('$destroy', function onDestroy() {
                UserContextService.SetSecondaryMenuName("business", "app.business.add", "新增商户信息");
            });
        }])
        .controller("ApplyListCtrl", ['$scope', 'ecHttp', 'ecWidget', '$state', function ($scope, ecHttp, ecWidget, $state) {
            $scope.pageInfo = {
                CurPage: 1,
                TotalPages: 1,
                TotalRows: 0,
                PageSize: 10
            };
            $scope.Condition = {};
            $scope.auditState = {
                1: "待审核",
                2: "审核通过",
                3: "已驳回"
            };
            $scope.stateList = [];
            $scope.businessList = [];

            function initData() {
                for (var k in $scope.auditState) {
                    var item = {};
                    item.Id = k;
                    item.Name = $scope.auditState[k];
                    $scope.stateList.push(item);
                }
                getBusinessList();
            }

            function getBusinessList() {
                var param = {};
                param.CurPage = $scope.pageInfo.CurPage;
                param.PageSize = $scope.pageInfo.PageSize;
                param = angular.extend(param, $scope.Condition);
                ecHttp.Get('ApplySaler/List', param).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    $scope.businessList = data.Value.data;
                    $scope.pageInfo.TotalRows = angular.copy(data.Value.totalRows);
                    $scope.pageInfo.TotalPages = Math.ceil($scope.pageInfo.TotalRows / $scope.pageInfo.PageSize);
                });
            }

            initData();
            $scope.search = function (curPage) {
                $scope.pageInfo.CurPage = curPage || $scope.pageInfo.CurPage;
                getBusinessList();
            };
            $scope.clear = function () {
                $scope.Condition = {};
            };
            $scope.pass = function (index) {
                var data = {
                    Id: $scope.businessList[index].OrgId,
                    type: 'isAudit'
                };
                $state.go("app.business.add", data);
            };
            $scope.reject = function (index) {
                ecWidget.Refuse().then(function (data) {
                    auditRefuse(data);
                });
                function auditRefuse(remark) {
                    var param = {};
                    param.OrgId = $scope.businessList[index].OrgId;
                    param.Remark = remark || "";
                    ecHttp.Post("ApplySaler/AuditRefuse", param).then(function (data) {
                        if (data.Code != 0) {
                            ecWidget.ShowMessage(data);
                            return;
                        }
                        $scope.businessList[index].AuditState = 3;
                        ecWidget.ShowToaster("success", "操作提示", "操作成功");
                    })
                }
            };
        }])
        .controller('ScepterCtrl', ['$rootScope', '$scope', 'ecWidget', 'ecHttp', '$filter', 'MESG_TYPE', function ($rootScope, $scope, ecWidget, ecHttp, $filter, MESG_TYPE) {
            $scope.myScepter = window.MercAppData.mercPrivilege;
            $scope.activeFlag = [true, false, false, false];
            $scope.markInfo = {
                AllChecked: false
            };
            $scope.root = {
                Value: false
            };
            $scope.template = {};
            $scope.Template = {
                Name: "",
                Remark: ""
            };
            var reqUrl = "";
            var curScepId = '';
            $scope.newScepter = {};
            $scope.submitted = false;
            getScepter();
            function getScepter() {
                ecHttp.Get("Scepter/List").then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    $scope.scepters = data.Value;
                    if (!!$scope.scepters) {
                        for (var i = 0; i < $scope.scepters.length; i++) {
                            $scope.scepters[i].isChecked = false;
                        }
                    }
                    $scope.markInfo.AllChecked = false;
                });
            }

            function getModuleList(Id) {
                ecHttp.Get("Scepter/ModuleList", {TemplateId: Id}).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    var roleCode = [];
                    angular.forEach($scope.myScepter, function (item) {
                        item.value = false;
                        $scope.changeState(item);
                    });
                    angular.forEach(data.Value, function (item) {
                        angular.forEach($scope.myScepter, function (item1) {
                            if (item1.Id === item) {
                                item1.value = true;
                                roleCode.push(item1.Id)
                            }
                            if (item1.children.length != 0) {
                                angular.forEach(item1.children, function (item2) {
                                    if (item2.Id === item) {
                                        item2.value = true;
                                        roleCode.push(item2.Id)
                                    }
                                    if (item2.children.length != 0) {
                                        angular.forEach(item2.children, function (item3) {
                                            if (item3.Id === item) {
                                                item3.value = true;
                                                roleCode.push(item3.Id)
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                    checkTreeState();
                });
            }

            $scope.remove = function (index) {
                ecWidget.ShowMessage("确认要删除吗？", MESG_TYPE.Ask).then(
                    function (result) {
                        ecHttp.Post("Scepter/Delete", {"TemplateId": $scope.scepters[index].Id}).then(function (data) {
                            if (data.Code != 0) {
                                ecWidget.ShowMessage(data);
                                return;
                            }
                            ecWidget.ShowToaster("success", "操作提示", "删除成功！");
                            $scope.scepters.splice(index, 1);
                            $scope.selectScepter(index - 1);
                        })
                    })
            };
            $scope.changeState = function (p) {
                if (p.children.length != 0) {
                    angular.forEach(p.children, function (item) {
                        item.value = p.value;
                        angular.forEach(item.children, function (item) {
                            item.value = p.value;
                        })
                    })
                }
                //祖先节点同步
                checkTreeState();
            };
            function checkTreeState() {
                angular.forEach($scope.myScepter, function (item1) {
                    if (item1.children.length != 0) {
                        angular.forEach(item1.children, function (item2) {
                            if (item2.children.length != 0) {
                                item2.value = compute(item2.children);
                            }
                        });
                        item1.value = compute(item1.children);
                    }
                });
                $scope.root.Value = compute($scope.myScepter);
            }

            function compute(arr) {
                var trueCount = 0, notallCount = 0;
                angular.forEach(arr, function (item, key) {
                    if (item.value === true) {
                        trueCount++;
                    }
                    if (item.value === "notall") {
                        notallCount++;
                    }
                });
                if (notallCount != 0) {
                    return 'notall';
                }
                if (trueCount == arr.length) {
                    return true;
                }
                if (trueCount == 0) {
                    return false;
                }
                else {
                    return 'notall';
                }
            }

            $scope.selectAll = function (rootValue) {
                angular.forEach($scope.myScepter, function (item) {
                    item.value = rootValue;
                    $scope.changeState(item);
                })
            };

            $scope.saveInfo = function (isValid) {
                if (!isValid) {
                    $scope.submitted = true;
                    return;
                }
                ecHttp.Post(reqUrl, $scope.template).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    if (!$scope.template.Id) {
                        $scope.template.Id = data.Value;
                    }
                    ecWidget.ShowToaster("success", "操作提示", "操作成功！");
                });
                $scope.changeTab(0);
            };
            $scope.cancel = function () {
                $scope.changeTab(0);
            };
            //保存权限
            $scope.authoritySave = function () {
                //获取所有选中节点的ID
                var authorityIds = [];
                var param = {};
                angular.forEach($scope.myScepter, function (item1) {
                    if (item1.value !== false && item1.Id !== 0 && item1.children.length == 0) {
                        authorityIds.push(item1.Id.toString());
                    }
                    if (item1.children.length != 0) {
                        angular.forEach(item1.children, function (item2) {
                            if (item2.value !== false && item2.Id !== 0 && item2.children.length == 0) {
                                authorityIds.push(item2.Id.toString());
                            }
                            if (item2.children.length != 0) {
                                angular.forEach(item2.children, function (item3) {
                                    if (item3.value !== false && item3.Id !== 0 && item3.children.length == 0) {
                                        authorityIds.push(item3.Id.toString());
                                    }
                                })
                            }
                        });
                    }
                });
                param.ModuleIdList = authorityIds;
                param.TemplateId = curScepId;
                ecHttp.Post("Scepter/SaveTemplate", {TemplateAuth: angular.toJson(param)}).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    ecWidget.ShowToaster("success", "操作提示", "保存成功！");
                    $scope.changeTab(0);
                })
            };


            $scope.addTab = function () {
                $scope.template = {};
                $scope.changeTab(2);
                reqUrl = "Scepter/Add";
            };
            $scope.editTab = function (index) {
                $scope.template = $scope.scepters[index];
                $scope.changeTab(3);
                reqUrl = "Scepter/Edit";
            };

            $scope.editSce = function (index, type) {
                $scope.changeTab(1);
                if (type == 'read') {
                    $scope.cannotEdit = true;
                }
                var item = $scope.scepters[index];
                curScepId = item.Id;
                getModuleList(curScepId);
                $scope.Template.Name = item.TemplateName;
                $scope.Template.Remark = item.Remark;
            };
            $scope.changeTab = function (index) {
                if (index == 0) {
                    $scope.cannotEdit = false;
                    getScepter();
                }
                $scope.activeFlag = [false, false, false, false];
                $scope.activeFlag[index] = true;
            };
        }])
        .controller("CompanyCategoryCtrl", ["$scope", 'ecWidget', 'ecHttp', '$filter', 'MESG_TYPE', 'UserContextService', function ($scope, ecWidget, ecHttp, $filter, MESG_TYPE, UserContextService) {
            $scope.root = {
                Id: '1',
                SortName: "全部分类",
                Name: "全部分类",
                PId: '0',
                SortTag: "全部分类",
                ParentName: "无",
                Level: 0,
                Children: $scope.branchList || []
            };
            $scope.curBranch = {Children: []};
            $scope.isAllow = true;


            //选中列表项
            $scope.selectBranch = function (parentBranch, isFirstLevel) {

                parentBranch.isExpand = !parentBranch.isExpand;
                if (isFirstLevel && parentBranch.Children && !parentBranch.isExpand) {
                    angular.forEach(parentBranch.Children, function (item) {
                        item.isExpand = false;
                    })
                }
                var parentId = parentBranch.Id;

                if (parentBranch.isParent && (!parentBranch.Children || parentBranch.Children.length == 0)) {
                    getBranchListById(parentId);
                    return;
                }

                $scope.curBranch = parentBranch;
            };

            $scope.$watch("curBranch", function (newData, oldData) {
                if (!oldData || !oldData.Id) {
                    return;
                }
                $scope.$emit('to-parent', $scope.curBranch);
            });

            //列表加载初始化数据
            function getCategoryList() {
                getBranchListById("1", setFirstItemToFocus);
                function setFirstItemToFocus() {
                    $scope.root.Children = $scope.branchList;
                    $scope.curBranch = $scope.root;
                    $scope.$emit('to-parent', $scope.curBranch);
                }
            };

            //获取行业分类列表
            function getBranchListById(parentId, handleFn) {
                ecHttp.Get("Category/Children", {id: parentId}).then(function (data) {
                    if (data.Code != 0) {
                        ecWidget.ShowMessage(data);
                        return;
                    }
                    var parent = {};
                    angular.forEach(data.Value, function (item) {
                        item.Name = item.SortName;
                        item.ParentName = "全部分类";
                    });

                    if (parentId == "1") {
                        $scope.branchList = data.Value;
                    } else {
                        parent = GetBranchById(parentId);
                        angular.forEach(data.Value, function (item) {
                            item.ParentName = parent.SortName;
                        });
                        parent.Children = data.Value;
                        $scope.curBranch = parent;
                    }
                    if (!!handleFn) {
                        handleFn();
                    }
                })
            }

            //树递归遍历
            function GetBranchById(Id) {
                var tree = $scope.root;
                return UserContextService.FindNodeFormTree(tree, Id);
            }

            getCategoryList();
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