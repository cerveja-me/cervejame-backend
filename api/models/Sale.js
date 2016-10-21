/**
 * Sale.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var uuid = require('node-uuid');

 module.exports = {

  attributes: {
    id: { type: 'string', required: true,  primaryKey: true ,defaultsTo:function() {return uuid.v4();} },
    location:{model:'location',required:true},
    payment:{type: 'string', required: true},
    finishedAt:{type:'datetime', required:false},
    value: {type: 'float',required: false},
  },
  prepareData: function(params) {
    var s = {};
    s.location = params.location;
    s.payment=params.payment;
    s.finishedAt=params.finishedAt;
    return s;
  },
};
