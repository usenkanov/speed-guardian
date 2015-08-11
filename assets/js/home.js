angular
    .module('SpeedGuardianApp', [])
    .controller('HomeController', function ($scope, $http) {

        $scope.projects = [];
        $scope.theProject = {};

        var reinitProject = function () {
            $scope.theProject = {
                cronRegex: '0 3,9,15,21 * * *'
            };
        };

        var loadProjects = function () {
            $http.get('/project').success(function (data) {
                $scope.projects = data;
            });
        };

        loadProjects();
        reinitProject();

        $scope.showAddModal = function () {
            $('#project-modal').modal('show');
        };

        $scope.showEditModal = function (id) {
            var key = _.findKey($scope.projects, function (project) {
                return project.id == id;
            })
            $scope.theProject = $scope.projects[key];
            $('#project-modal').modal('show');
        };

        $scope.deleteProject = function (id) {
            $http
                .delete('/project/' + id)
                .then(function onSuccess() {
                    loadProjects();
                }, function onFailure(response) {
                    alert("Something went wrong: " + response);
                });
        };

        $scope.saveProject = function () {
            var url = '/project';
            if($scope.theProject.id) {
                url += "/" + $scope.theProject.id;
            }
            $http
                .post(url, {
                    name: $scope.theProject.name,
                    host: $scope.theProject.host,
                    cronRegex: $scope.theProject.cronRegex,
                    paths: $scope.theProject.paths
                })
                .then(function onSuccess() {
                    $('#project-modal').modal('hide');
                    loadProjects();
                    reinitProject();
                }, function onFailure(response) {
                    alert("Something went wrong: " + response);
                });

        };
    });