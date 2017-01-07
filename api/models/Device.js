/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var uuid = require('node-uuid');

 module.exports = {
  autoPK: false,
  attributes: {
   id: { type: 'string', required: true,  primaryKey: true  },
   push_token: { type: 'string', required: true },
   costumer:{model:'costumer',required:false},
   type:{ type: 'string', required: false},
 },
 prepareData: function(params) {
  var d = {};
  d.id = uuid.v4();
  d.push_token = params.push_token;
  d.costumer=params.costumer;
  d.type=params.type;
  return d;
},
};

