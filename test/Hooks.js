/*global sails: true */
var sails = require('sails');
var Barrels = require('barrels');

before(function (done) {
    var options = {
        port: 1338,
        models: {
            connection: 'localTestDb'
        },
        connections: {
            localTestDb: {
                adapter: 'sails-memory'
            }
        },
        appconfs: {
            url: 'http://localhost:1338',
            isTest: true
        }
        // This might be required in the future to load custom hooks
        // loadHooks: ['moduleloader', 'request', 'orm', 'blueprints', 'responses', 'controllers', 'policies', 'services', 'userconfig', 'session', 'http']
    };
    sails.lift(options, function (err, sails) {
        if (err) { return done(err); }
        console.log('Sails up... ');

        var barrels = new Barrels();
        barrels.populate(['project'], function (err) {
            if (err) { return done(err); }
            console.log('Barreling DB');
            done(err, sails);
        });
    });
});

after(function (done) {
    sails.lower(_.once(done));
});
