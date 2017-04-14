/**
 * Created by CAOTE on 12/11/2016.
 */
/**
 * Created by CAOTE on 12/11/2016.
 */


var app = angular.module("databot");
app.controller('homeCtrl',['$scope','$window', '$http', homeCtrl]);
function homeCtrl($scope, $window, $http){
    $scope.chooseTab = function(type){
        $window.location.href = '/home#/'+type;
    }

    $scope.logout = function(){
        var request = {
            method: 'POST',
            url: '/logout'
        };
        $http(request)
            .success(function(data){
                $window.location.replace($window.location.origin);
            });
    }
}
