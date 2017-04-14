/**
 * Created by CAOTE on 12/11/2016.
 */
/**
 * Created by CAOTE on 12/11/2016.
 */


var app = angular.module("databot");
app.controller('loginCtrl',['$scope','$window','$http',loginCtrl]);

function loginCtrl($scope, $window,$http){
    $scope.keyUp = function(e){
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.login();
        }
    }
    $scope.login=function(){
        $http({
            method: "POST",
            url: "/login",
            data:$scope.user
        }).success(function(data, status) {
            if(data.success && data.resultCode=='01'){
                window.location='/home';
            }else if(data.success && data.resultCode=='00'){
                $scope.message=data.message;
            }
        }).error(function(data, status) {
            //$scope.data = data || "Request failed";
            //$scope.status = status;
        });

    }

    $scope.clearMessage=function(){
        $scope.message="";
    }


}
