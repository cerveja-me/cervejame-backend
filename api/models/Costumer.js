/**
 * Costumer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var uuid = require('uuid');

module.exports = {
  autoPK: false,
  attributes: {
    id: {type: 'string', required: true, primaryKey: true},
    device: {model: 'device', required: true},
    name: {type: 'string', required: true},
    email: {type: 'string', required: true},
    password: {type: 'string', required: true},
    facebook_id: {type: 'string', required: false},
    facebook_token: {type: 'string', required: false},
    phone: {type: 'string', required: false},
  },
  prepareData: function (params) {
    var c = params;
    c.id = uuid.v4();
    return c;
  }
};
