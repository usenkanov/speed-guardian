/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      name: {
          type: 'string',
          required: true
      },
      host: {
          type: 'string',
          required: true
      },
      paths: {
          type: 'array',
          required: true
      },
      cronRegex: {
          type: 'string',
          required: true
      }
  }
};

