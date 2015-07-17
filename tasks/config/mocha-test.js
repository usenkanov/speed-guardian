/**
 * A grunt task for running server side mocha tests.
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 * https://github.com/pghalliday/grunt-mocha-test
 */
module.exports = function (grunt) {

    grunt.config.set('mochaTest', {
        default: {
            options: {
                reporter: 'spec',
                timeout: 10000
            },
            src: ['test/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');

};
