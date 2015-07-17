var schedule = require('node-schedule');
var uuid = require('node-uuid');
var Promise = require('bluebird');
var phantomjs = require('phantomjs');
var util = require('util');
var async = require('../../node_modules/sails/node_modules/async');

var tempJobNames = [];
var concurrency = 3;

var jobs = [
    {
        cron: '* * * * *',
        paths: [
            '/',
            '/place/Mount-Tambora',
            '/science/volcano'
        ],
        domain: 'http://www.britannica.com'
    },
    {
        cron: '*/2 * * * *',
        paths: [
            '/post/253626/',
            '/post/253620/'
        ],
        domain: 'http://geektimes.ru/'
    }
];

module.exports = {

    schedule: function (req, res) {
        var canceledJobs = [];

        Promise.resolve()
            .then(function () {
                return new Promise(function (resolve) {
                    tempJobNames.forEach(function (jobName) {
                        schedule.cancelJob(jobName);
                        canceledJobs.push(jobName);
                    });
                    tempJobNames = [];
                    return resolve();
                });
            })
            .then(function () {
                return new Promise(function (resolve) {
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
                var result = '<b>Schedules re-initiated!</b> <br>';
                result += '<br>';
                result += 'List of scheduled jobs:<br>' + tempJobNames.join('<br>');
                result += '<br><br>';
                result += 'List of cancelled jobs:<br>' + canceledJobs.join('<br>');
                return res.send(result);
            })
            .catch(function (err) {
                util.error(err, err.stack);
                return res.serverError(err);
            });
    },
    showSchedule: function (req, res) {
        res.send();
    }
};

function runQueue(task) {
    var urls = [];
    task.paths.forEach(function (path) {
        urls.push(task.domain + path);
    });

    queue.push(urls);
    console.log(urls.length + ' urls queued');
}

function timePage(url) {
    var exec = require('child_process').exec;
    var script = process.cwd() + '/scripts/loadspeed.js';

    return new Promise(function (resolve) {
        exec('phantomjs ' + script + ' ' + url, function (err, stdout) {
            if (err) {
                return resolve(err);
            }
            var result = stdout.replace(/(\r\n|\n|\r)/gm,'');
            console.log('response time (ms):' + result + ' url: (' + url + ')');
            return resolve(result);
        });
    });
};

var queue = async.queue(function (job, callback) {
    timePage(job)
        .then(function (timeInMs) {
            return callback(timeInMs);
        })
        .catch(function (err) {
            util.error(err, err.stack);
            return callback(-1);
        });
}, concurrency);

queue.drain = function () {
    console.log('all items have been processed');
};


