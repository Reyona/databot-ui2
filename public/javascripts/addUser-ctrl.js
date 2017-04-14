/**
 * Created by CAOTE on 12/11/2016.
 */
/**
 * Created by CAOTE on 12/11/2016.
 */


var app = angular.module("databot");
app.controller('addUserCtrl',['$scope','$window','$http',addUserCtrl]);
function addUserCtrl($scope, $window,$http){
    $scope.reg=function(){
        if(!!$scope.user && !!$scope.user.userName && !!$scope.user.password){
            $http({
                method: "POST",
                url: "/addUser",
                data:$scope.user
            }).success(function(data, status) {
                if(data.success && data.resultCode=='01'){
                    $scope.message=data.message;
                    $scope.addUserDialogStyle = 'modal-success';
                }else if(data.success && data.resultCode=='00'){
                    $scope.message=data.message;
                    $scope.addUserDialogStyle = 'modal-warning';
                } else {
                    $scope.message=data.message;
                    $scope.addUserDialogStyle = 'modal-danger';
                }
                $('#addedUserModal').modal('show');
            }).error(function(data, status) {
                //$scope.data = data || "Request failed";
                //$scope.status = status;
            });
        } else {
            $scope.message = 'Please input userName and password';
            $scope.addUserDialogStyle = 'modal-info';
            $('#addedUserModal').modal('show');
        }



    }
}
