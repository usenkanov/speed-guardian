/**
 * SpeedMetricController
 *
 * @description :: Server-side logic for managing Speedmetrics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');

module.exports = {

    generateReport:function(req,res){
        var projectName = req.param('project');
        console.log("Inside generateReport... ");

        return Promise.resolve()
            .then(function () {
                return SpeedMetric.find({
                    sort: 'createdAt DESC'
                });
            })
            .then(function (speedMetrics) {
                var results = [];
                speedMetrics.forEach(function (speedMetric) {
                    console.log("speedMetric.url = " + speedMetric.url);
                    results.push(speedMetric);
                });
                console.log("Done querying")
                return res.view('report', {
                    speedMetrics: results,
                    projectName: projectName
                });
            });
    }

};

