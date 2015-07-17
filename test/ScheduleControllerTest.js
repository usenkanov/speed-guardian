var expect = require('chai').expect;
var request = require('supertest-as-promised');
var Promise = require('bluebird');

describe('ScheduleController', function () {

    describe('#schedule', function () {

        it('should schedule & re-schedule jobs', function (done) {
            Promise.resolve()
                .then(function () {
                    return new Promise(function (resolve) {
                        request.agent(sails.hooks.http.app)
                            .get('/schedule')
                            .expect(200)
                            .end(function (err, result) {
                                expect(result.res.body.is_successful).to.equal(true);
                                expect(result.res.body.scheduled.length).to.equal(2);
                                expect(result.res.body.unscheduled.length).to.equal(0);
                                return resolve();
                            });
                    });
                })
                .then(function () {
                    return new Promise(function (resolve) {
                        request.agent(sails.hooks.http.app)
                            .get('/schedule')
                            .expect(200)
                            .end(function (err, result) {
                                expect(result.res.body.is_successful).to.equal(true);
                                expect(result.res.body.scheduled.length).to.equal(2);
                                expect(result.res.body.unscheduled.length).to.equal(2);
                                return resolve();
                            });
                    });
                })
                .then(function () {
                    done();
                });
        });
    });
});
