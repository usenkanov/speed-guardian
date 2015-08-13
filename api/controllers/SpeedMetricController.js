/**
 * SpeedMetricController
 *
 * @description :: Server-side logic for managing Speedmetrics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');
var moment = require('moment');

module.exports = {

    getMetrics:function(req,res){
        var host = req.param('host');
        var url = req.param('url');

        var clause = {};
        if(host && url){
            clause.url = host + url;
        } else if(host) {
            clause.url = {
                contains: host
            };
        }

        return Promise.resolve()
            .then(function () {
                return SpeedMetric.find({
                    where: clause,
                    sort: 'createdAt DESC'
                });
            })
            .then(function (speedMetrics) {
                var results = [];
                speedMetrics.forEach(function (speedMetric) {
                    var dt = moment(speedMetric.createdAt);
                    speedMetric.ms = dt.valueOf();
                    results.push(speedMetric);
                });
                return res.send({
                    speedMetrics: results
                });
            });
    }

};

