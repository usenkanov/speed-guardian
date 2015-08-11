var schedule = require('node-schedule');
var uuid = require('node-uuid');
var Promise = require('bluebird');
var phantomjs = require('phantomjs');
var util = require('util');
var async = require('../../node_modules/sails/node_modules/async');

var tempJobNames = [];
var concurrency = 3;

module.exports = {

    schedule: function (req, res) {
        var canceledJobs = [];
        var result = {
            is_successful: false
        };

        Promise.resolve()
            .then(function () {
                return new Promise(function (resolve) {

                    Project.find()
                        .then(function (projects) {
                            var jobs = [];
                            projects.forEach(function (project) {
                                var paths = project.paths.toString().match(/[^\r\n]+/g);
                                jobs.push({
                                    cron: project.cronRegex,
                                    domain: project.host,
                                    paths: paths
                                });
                            });
                            return resolve(jobs);
                        })
                        .catch(function (err) {
                            return resolve(null, err);
                        });
                });
            })
            .then(function (jobs) {
                return new Promise(function (resolve) {

                    tempJobNames.forEach(function (jobName) {
                        schedule.cancelJob(jobName);
                        canceledJobs.push(jobName);
                    });
                    tempJobNames = [];

                    jobs.forEach(function (job) {
                        var cronJob = new schedule.Job(uuid.v4(), function () {
                            runQueue(job);
                        });
                        cronJob.schedule(job.cron);
                        tempJobNames.push(cronJob.name);
                    });

                    return resolve();
                });
            })
            .then(function () {
                result.is_successful = true;
                result.scheduled = tempJobNames;
                result.unscheduled = canceledJobs;

                return res.send(result);
            })
            .catch(function (err) {
                util.error(err, err.stack);
                return res.serverError(err);
            });
    },
    showScheduled: function (req, res) {
        var result = [];
        tempJobNames.forEach(function (jobName) {
            result.push(jobName);
        });
        return res.send(result);
    },
    unschedule: function (req, res) {
        var result = {
            is_successful: true
        };
        tempJobNames.forEach(function (jobName) {
            schedule.cancelJob(jobName);
        });
        tempJobNames = [];
        return res.send(result);
    }
};

function runQueue(task) {
    var urls = [];
    task.paths.forEach(function (path) {
        urls.push(task.domain.trim() + path.trim());
    });

    executionQueue.push(urls);
    console.log(urls.length + ' urls queued');
}

function timePage(url) {
    var exec = require('child_process').exec;
    var script = process.cwd() + '/scripts/loadspeed.js';

    return new Promise(function (resolve, reject) {
        exec('phantomjs ' + script + ' ' + url, function (err, stdout) {
            if (err) {
                return reject(err);
            }
            var result = stdout.replace(/(\r\n|\n|\r)/gm, '');
            console.log('response time (ms):' + result + ' url: (' + url + ')');
            return resolve(result);
        });
    });
};

var executionQueue = async.queue(function (url, callback) {
    timePage(url)
        .then(function (timeInMs) {
            SpeedMetric
                .create({
                    url: url,
                    value: timeInMs
                }).exec(function (err) {
                    if(err) {
                        return callback(err);
                    }
                    return callback();
                });
        })
        .catch(function (err) {
            util.error(err, err.stack);
            return callback(-1);
        });
}, concurrency);

executionQueue.drain = function () {
    console.log('all items have been processed---------------');
};


