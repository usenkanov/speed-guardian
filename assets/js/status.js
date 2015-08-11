angular
    .module('SpeedGuardianApp', [])
    .controller('StatusController', function ($scope, $http) {

        $scope.jobIds = [];

        var loadJobIds = function () {
            $http.get('/showScheduled').success(function (data) {
                $scope.jobIds = data;
            });
        };

        loadJobIds();

        $scope.scheduleJobs = function () {
            $http
                .get('/schedule')
                .then(function onSuccess() {
                    loadJobIds();
                }, function onFailure(response) {
                    alert('Something went wrong: ' + response);
                });
        };

        $scope.unscheduleJobs = function () {
            $http
                .get('/unschedule')
                .then(function onSuccess() {
                    loadJobIds();
                }, function onFailure(response) {
                    alert('Something went wrong: ' + response);
                });
        };
    });