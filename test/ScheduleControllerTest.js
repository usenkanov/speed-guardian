var expect = require('chai').expect;
var request = require('supertest-as-promised');

describe('ScheduleController', function () {

    describe('#schedule', function () {

        it('should schedule jobs', function (done) {
            request.agent(sails.hooks.http.app)
                .get('/schedule')
                .expect(200)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }
                    expect(result.res.body.is_successful).to.equal(true);
                    expect(result.res.body.scheduled.length).to.equal(2);
                    expect(result.res.body.unscheduled.length).to.equal(0);
                    done();
                });
        });
    });
});
