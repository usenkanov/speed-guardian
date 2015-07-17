/**
 * SpeedMetricController
 *
 * @description :: Server-side logic for managing Speedmetrics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    attributes: {
        url: {
            type: 'string',
            required: true
        },
        value: {
            type: 'string',
            required: true
        }
    }
};

