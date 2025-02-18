/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require('uuid');

module.exports = {
  autoPK: false,

  attributes: {
    id: {
      type: 'string',
      required: true,
      primaryKey: true,
      defaultsTo: function () {
        return uuid.v4();
      },
      unique: true,
      index: true,
      uuidv4: true
    },
    device: {type: 'string', required: true},
    name: {type: 'string', required: true},
    email: {type: 'string', required: true},
    img: {type: 'string', required: false},
    password: {type: 'string', required: true},
    phone: {type: 'string', required: false},
    push: {type: 'string', required: false},
    zone: {model: 'zone', required: true}
  }
};

