(function () {

// ROUTING ===============================================
// set our routing for this application
// each route will pull in a different controller
    angular.module('databot').config(['$routeProvider', configRoute]);
    angular.module('databot').factory('Page', function () {
        var title = 'databot';
        return {
            title: function () {
                return title
            },
            setTitle: function (newTitle) {
                title = newTitle;
                return title;
            }
        };
    });
    angular.module('databot')
        .controller('mainController', mainController);
    mainController.$inject =
        [
            '$scope',
            'Page'
        ];

    function mainController($scope, Page) {
        $scope.Page = Page;
    }

    function configRoute($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/issueRecord.html',
                controller: 'issueRecordCtrl',
                controllerAs: 'vm'
            })
            .when('/addUser', {
                templateUrl: 'views/addUser.html',
                controller: 'addUserCtrl',
                controllerAs: 'vm'
            })
            .when('/issueRecord', {
                templateUrl: 'views/issueRecord.html',
                controller: 'issueRecordCtrl',
                controllerAs: 'vm'
            });
    }
})();
