/**
 * Created by ZENGJO on 3/17/2017.
 */


(function(){
    var app = angular.module("databot");
    app.controller("issueRecordCtrl",['$scope', '$http', issueRecordCtrl]);
    function issueRecordCtrl($scope, $http) {

        var vm = this;
        $scope.canUpdate = (readOnly == 'false');
        console.log('readOnly:'+readOnly);
        console.log('canUpdate:'+$scope.canUpdate);

        vm.name = null;
        vm.L = null;
        vm.data = null;
        vm.skipIgnored = null;
        vm.type = null;
        vm.checkboxLODS = null;
        vm.checkboxIR4 = null;
        vm.upStreamForSelect = [];
        vm.flowNameForSelect = [];
        vm.createdAtFrom = null;
        vm.createdAtTo = null;

        $('#startDate1').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 0,
            forceParse: 0
        });
        $('#endDate1').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 0,
            forceParse: 0
        });

        vm.issueRecordGrid = {
            columnDefs: [
                {
                    field: 'isSelected',
                    displayName: '',
                    enableFiltering: false,
                    width: '2%',
                    cellTemplate: "<input id='isSelected' ng-disabled='row.entity.ignore' type='checkbox' ng-model='row.entity.isSelected' />"
                },
                {field: 'L', displayName: 'Left', width: '7%'},
                {field: 'R', displayName: 'Right', width: '7%'},
                {field: 'data', displayName: 'Data'},
                {field: 'key', displayName: 'Key', width: '10%'},
                {field: 'specFileName', displayName: 'specFileName'},
                {field: 'data extraction from', displayName: 'dataExtractionFrom', width: '9%'},
                {field: 'data extraction to', displayName: 'dataExtractionTo', width: '9%'},
                {field: 'createdAt', displayName: 'createdAt', width: '9.5%'},
                {field: 'updatedAt', displayName: 'updatedAt', width: '9.5%'},
                {
                    field: 'ignore',
                    displayName: 'Ignore',
                    width: '4%',
                    cellTemplate:"<p ng-class='{\"text-ignored\":row.entity.ignore}' style='text-align: center;line-height: 2;'>{{row.entity.ignore}}</p>"
                },
                {
                    name: 'operation',
                    enableFiltering: false,
                    width: '5%',
                    displayName: '',
                    cellTemplate: "<button id='detailBtn' type='button' " +
                    "class='btn btn-alm btn-sm' ng-click='grid.appScope.vm.viewIssueRecordDetail(row.entity)' " +
                    "style='margin-left: 15px; height: 26px;margin-top: 3px;' >View</button>"//ng-disabled='grid.appScope.GLOBAL_ReadOnly'
                }
            ],
            cellEditableCondition: false,

            paginationPageSize: 100,
            paginationPageSizes: false,
            useExternalPagination:true,
            totalItems: 0,
            paginationCurrentPage: 1,

            enableFiltering: true,
            enableGroupHeaderSelection: true,
            treeRowHeaderAlwaysVisible: true,
            enableColumnResizing: true,
            multiSelect: false,
            enableRowHeaderSelection: false,
            enableRowSelection: false,

            enableGridMenu: true,
            //enableSelectAll: true,
            exporterCsvFilename: 'Region.csv',
            exporterPdfDefaultStyle: {fontSize: 9},
            exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
            exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
            exporterPdfHeader: {text: "My Header", style: 'headerStyle'},
            exporterPdfFooter: function (currentPage, pageCount) {
                return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
            },
            exporterPdfCustomFormatter: function (docDefinition) {
                docDefinition.styles.headerStyle = {fontSize: 22, bold: true};
                docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope,function(newPage, pageSize) {
                    vm.getIssueRecords(newPage,pageSize);
                });
            }
        };

        vm.getAllIssueRecords = function (page,pageSize) {
            var request = {
                method: 'GET',
                url: '/uncleanedRecords',
                params:{
                    page:page,
                    pageSize:pageSize
                }
            };
            $http(request)
                .success(function (data) {
                    if (data.result.length > 0) {
                        var cleanIsFalseRecords = [];
                        _.each(data.result, function (obj) {
                            if (obj.cleaned === false) {
                                obj.createdAt = _.isEmpty(obj.createdAt)?'':moment.utc(obj.createdAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                                obj.updatedAt = _.isEmpty(obj.updatedAt)?'':moment.utc(obj.updatedAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                                obj['execution time'] = _.isEmpty(obj['execution time'])?'':moment.utc(obj['execution time']).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                                obj['data extraction from'] = _.isEmpty(obj['data extraction from'])?'':moment.utc(obj['data extraction from'],'YYYYMMDDHHmmss.SSS').utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                                obj['data extraction to'] = _.isEmpty(obj['data extraction to'])?'':moment.utc(obj['data extraction to'],'YYYYMMDDHHmmss.SSS').utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                                obj.logs = (function(){
                                    var timeString = _.isEmpty(obj.logs)?'':moment.utc(obj.logs,'YYYY-MM-DDTHH:mm:ss.SSSZ').utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                                    var content = (obj.logs.split(': '))[1];
                                    return timeString + ': ' + content;
                                })();
                                cleanIsFalseRecords.push(obj);
                            }
                        });
                        console.log(cleanIsFalseRecords);
                        vm.issueRecordGrid.totalItems = data.totalCount;
                        vm.issueRecordGrid.data = cleanIsFalseRecords;
                        console.log("succ");
                    } else {
                        vm.searchResult = 'No Data Found!';
                        vm.searchDialogStyle = 'modal-info';
                        $('#searchResultModal').modal('show');
                        setTimeout(function () {
                            $('#searchResultModal').modal('hide');
                        }, 3000);
                    }

                })
                .error(function (data, status, headers) {
                    vm.searchResult = 'System Error!';
                    vm.searchDialogStyle = 'modal-info';
                    $('#searchResultModal').modal('show');
                    setTimeout(function () {
                        $('#searchResultModal').modal('hide');
                    }, 3000);
                    console.log('error');
                });
        };
        vm.getAllIssueRecords(vm.issueRecordGrid.paginationCurrentPage, vm.issueRecordGrid.paginationPageSize);

        vm.viewIssueRecordDetail = function (issueRecordObject) {
            vm.recordDetail = issueRecordObject;
            $('#issueRecordDetailModal').modal('show');
        };


        var selectedRecords = [];
        function getSelectedRecords(data) {
            selectedRecords = [];
            _.each(data, function (object) {
                if (object.isSelected === true) {
                    selectedRecords.push(object)
                }
            });
        }

        vm.ignoreAllValidation = function () {
            getSelectedRecords(vm.issueRecordGrid.data);
            if (selectedRecords.length === 0) {
                $('#selectIssueRecordsModal').modal('show');
            } else {
                $('#ignoreAllConfirmModal').modal('show');
            }
        };

        vm.ignoreConfirm = function () {
            $('#ignoreAllConfirmModal').modal('hide');
            var updateCriteriaArray = [];
            _.each(selectedRecords, function (obj) {
                var criteria = {};
                criteria._id = obj._id;
                criteria.ignore = true;
                updateCriteriaArray.push(criteria);
            });
            var request = {
                method: 'POST',
                url: '/uncleanedRecords',
                data: {
                    'criteria': {
                        ignoreRecords: updateCriteriaArray
                    }
                }
            };
            $http(request)
                .success(function (data) {
                    vm.ignoreUpdateResult = 'Ignore Success!';
                    vm.updateDialogStyle = 'modal-success';
                    $('#ignoreUpdateModal').modal('show');
                    setTimeout(function () {
                        $('#ignoreUpdateModal').modal('hide');
                        vm.getIssueRecords(vm.issueRecordGrid.paginationCurrentPage, vm.issueRecordGrid.paginationPageSize);//**********
                    }, 3000);
                    console.log('Ignore Success!');
                })
                .error(function (data, status, headers) {
                    vm.ignoreUpdateResult = 'Ignore Failed!';
                    vm.updateDialogStyle = 'modal-danger';
                    $('#ignoreUpdateModal').modal('show');
                    setTimeout(function () {
                        $('#ignoreUpdateModal').modal('hide');
                    }, 3000);
                    console.log('Ignore Failed!');
                });

        };


        vm.selectProject = function (project) {
            console.log('selectProject:'+project);
            vm.L = '';
            vm.name = '';
            vm.upStreamForSelect = [];
            vm.flowNameForSelect = [];
            if('LODS' === project) {
                if(vm.checkboxLODS) {
                    vm.checkboxIR4 = false;
                    vm.type = project;
                }
                else vm.type = '';
            }
            if('IR4' === project) {
                if(vm.checkboxIR4) {
                    vm.checkboxLODS = false;
                    vm.type = project;
                }
                else vm.type = '';
            }
            getUpStreamForSelect();
        };

        function getUpStreamForSelect() {
            if(vm.type) {
                vm.upStreamForSelect = ['Loading...'];
                var request = {
                    method: 'GET',
                    url: '/upstreams',
                    params:{
                        project:vm.type
                    }
                };
                $http(request)
                    .success(function (data) {
                        console.log(data);
                        vm.upStreamForSelect = data;
                    })
                    .error(function (err) {
                        //process error
                    });
            }
        }

        vm.getFlowNameByUpStream = function(){
            if(vm.L) {
                vm.flowNameForSelect = ['Loading...'];
                var request = {
                    method: 'GET',
                    url: '/flowNames',
                    params:{
                        project: vm.type,
                        L: vm.L
                    }
                };
                $http(request)
                    .success(function (data) {
                        console.log(data);
                        vm.flowNameForSelect = data;
                    })
                    .error(function (err) {
                        //process error
                    });
            }
        };

        vm.resetBtnClick = function(){
            vm.checkboxLODS = null;
            vm.checkboxIR4 = null;
            vm.upStreamForSelect = [];
            vm.flowNameForSelect = [];
            vm.data = null;
            vm.createdAtFrom = null;
            vm.createdAtTo = null;
            vm.skipIgnored = null;
        };

        function getCriteriaForIssueRecords(){
            var criteria = {};
            criteria.cleaned = false;
            if( !_.isEmpty(vm.L)){
                criteria.L = vm.L;
            }
            if( !_.isEmpty(vm.name)){
                criteria.name = vm.name;
            }
            if( !_.isEmpty(vm.data)){
                criteria.data = {$regex: vm.data, $options:'i'};
            }
            if(vm.skipIgnored){
                criteria.ignore = false;
            }
            if(!_.isEmpty(vm.createdAtFrom) || !_.isEmpty(vm.createdAtTo)){
                var createdAtFrom = _.isEmpty(vm.createdAtFrom)?0:moment(vm.createdAtFrom).utcOffset("-8:00").format('YYYY-MM-DD HH:mm:ss');
                var createdAtTo = _.isEmpty(vm.createdAtTo)?9999999990000:moment(vm.createdAtTo).utcOffset("-8:00").format('YYYY-MM-DD HH:mm:ss');
                criteria.createdAtFrom = createdAtFrom;
                criteria.createdAtTo = createdAtTo;
            }

            return criteria;
        }


        vm.searchValidation = function () {
            if (!_.isEmpty(vm.createdAtFrom)&&!_.isEmpty(vm.createdAtTo)){
                if (!_.isEmpty(vm.name)||!_.isEmpty(vm.data)){
                    vm.getIssueRecords(vm.issueRecordGrid.paginationCurrentPage, vm.issueRecordGrid.paginationPageSize);
                }else {
                    vm.searchValidationResult = "Input at least one filed marked with * : FlowName or Data!";
                    $('#searchValidationModal').modal('show');
                }
            }else {
                vm.searchValidationResult = "Records Created Date is mandatory, please input date range!";
                $('#searchValidationModal').modal('show');
            }
        };
        vm.getIssueRecords = function(page,pageSize){
            var criteria = getCriteriaForIssueRecords();
            var request = {
                method: 'PUT',
                url:  '/uncleanedRecords',
                data: {
                    'criteria': criteria
                },
                params:{
                    'page': page,
                    'pageSize': pageSize
                }
            };
            $http(request)
                .success(function (data) {
                    var searchIssueRecords = [];
                    _.each(data.result, function (obj) {
                        if (obj.cleaned === false) {
                            obj.createdAt = _.isEmpty(obj.createdAt)?'':moment.utc(obj.createdAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                            obj.updatedAt = _.isEmpty(obj.updatedAt)?'':moment.utc(obj.updatedAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                            obj['execution time'] = _.isEmpty(obj['execution time'])?'':moment.utc(obj['execution time']).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                            obj['data extraction from'] = _.isEmpty(obj['data extraction from'])?'':moment.utc(obj['data extraction from'],'YYYYMMDDHHmmss.SSS').utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                            obj['data extraction to'] = _.isEmpty(obj['data extraction to'])?'':moment.utc(obj['data extraction to'],'YYYYMMDDHHmmss.SSS').utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                            obj.logs = (function(){
                                var timeString = _.isEmpty(obj.logs)?'':moment.utc(obj.logs,'YYYY-MM-DDTHH:mm:ss.SSSZ').utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
                                var content = (obj.logs.split(': '))[1];
                                return timeString + ': ' + content;
                            })();
                            searchIssueRecords.push(obj);
                        }
                    });
                    vm.issueRecordGrid.data = null;
                    vm.issueRecordGrid.totalItems = data.totalCount;
                    vm.issueRecordGrid.data = searchIssueRecords;
                    if(data.totalCount<=0){
                        vm.searchResult = 'No Data Found!';
                        vm.searchDialogStyle = 'modal-info';
                        $('#searchResultModal').modal('show');
                        setTimeout(function () {
                            $('#searchResultModal').modal('hide');
                        }, 3000);
                    }
                    console.log("succ")
                })
                .error(function (data, status, headers) {
                    vm.searchResult = 'System Error!';
                    vm.searchDialogStyle = 'modal-danger';
                    $('#searchResultModal').modal('show');
                    setTimeout(function () {
                        $('#searchResultModal').modal('hide');
                    }, 3000);
                    console.log('error');
                });
        };
    }

})();

