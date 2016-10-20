/**
 * Costumer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var uuid = require('node-uuid');

 module.exports = {

  attributes: {
    id: { type: 'string', required: true,  primaryKey: true  },
    device:{model:'device',required:true},
    name:{type: 'string', required: true,  primaryKey: true  },
  },
  prepareData: function(params) {
    var c = {};
    c.id = uuid.v4();
    c.device = params.device;
    c.name=params.name;
    return c;
  },
};
