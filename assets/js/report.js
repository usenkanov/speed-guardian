'use strict';

/* Controllers */
google.load('visualization', '1', {packages: ['corechart', 'line']});

function drawGraph(speedMetric, divElementName) {
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'Time');
    data.addColumn('number', 'Load time');

    var points = _.map(speedMetric, function (value) {
        return [new Date(value.ms), value.value / 1000];
    });

    data.addRows(points);
    var chart = new google.visualization.LineChart(document.getElementById(divElementName));

    var options = {
        hAxis: {
            title: 'Time'
        },
        vAxis: {
            title: 'Load Time'
        }
    };
    chart.draw(data, options);
};

angular
    .module('SpeedGuardianApp', [])
    .controller('ReportController', function ($scope, $http) {

        $scope.speedMetrics = [];
        $scope.projects = [];
        $scope.urls = [];
        $scope.selectedProject;
        $scope.selectedUrl;

        $scope.regenerate = function () {
            generateGraph();
        };

        $scope.projectSelected = function () {
            var urls = $scope.selectedProject.paths.split("\n");
            $scope.urls = urls;
        };

        $scope.urlSelected = function () {
            console.log('y');
        };

        var init = function () {
            $http
                .get("/project")
                .then(function onSuccess(response) {
                    $scope.projects = response.data;
                }, function onFailure(response) {
                    alert('Something went wrong: ' + response);
                });
        };

        var generateGraph = function () {
            loadMetrics(function () {
                drawGraph($scope.speedMetrics, 'chart_div');
            });
        };

        var loadMetrics = function (callback) {
            $http({
                url: "/getMetrics",
                method: "GET",
                params: {
                    host: $scope.selectedProject.host,
                    url: $scope.selectedUrl
                }
            })
                .then(function onSuccess(response) {
                    $scope.speedMetrics = response.data.speedMetrics;
                    if (callback) {
                        callback();
                    }
                }, function onFailure(response) {
                    alert('Something went wrong: ' + response);
                });
        };

        init();
    });
