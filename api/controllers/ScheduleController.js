var schedule = require('node-schedule');
var uuid = require('node-uuid');
var Promise = require('bluebird');
var phantomjs = require('phantomjs');

var tempJobNames = [];

var jobs = [
    {
        cron: '*/1 * * * *',
        paths: [
            '/',
            '/place/Mount-Tambora',
            '/science/volcano'
        ],
        domains: [
            'www.britannica.com',
            'qa.britannica.com'
        ]
    },
    {
        cron: '*/2 * * * *',
        paths: [
            '/',
            '/high'
        ],
        domains: [
            'school.eb.com'
        ]
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
                        var scheduledJob = new schedule.Job(uuid.v4(), function () {
                        });
                        scheduledJob.schedule(job.cron, function () {
                            runJob(job);
                        });
                        tempJobNames.push(scheduledJob.name);
                    });
                    return resolve();
                });
            })
            .then(function () {
                var result = '<b>Schedules re-initiated!</b> <br>';
                result += '<br>';
                result += 'List of scheduled jobs:<br>' + tempJobNames.join('<br>');
                result += '<br>';
                result += 'List of cancelled jobs:<br>' + canceledJobs.join('<br>');
                return res.send(result);
            })
            .catch(function (err) {
                console.error(err, err.stack);
                return res.serverError(err);
            });
    },
    showSchedule: function (req, res) {
        res.send('List of scheduled jobs:<br>' + tempJobNames.join('<br>'));
    }
}

function runJob(job) {
    console.log('x');
}