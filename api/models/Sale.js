/**
 * Sale.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var uuid = require('node-uuid');
 var Q = require('q');

 module.exports = {
  autoPK: false,
  attributes: {
    id: { type: 'string', required: true,  primaryKey: true ,defaultsTo:function() {return uuid.v4();} },
    location:{model:'location',required:true},
    address:{ type: 'string', required: false},
    payment:{type: 'string', required: true},
    aceptedAt:{type:'datetime', required:false},
    onWayAt:{type:'datetime', required:false},
    finishedAt:{type:'datetime', required:false},
    prodreg:{model:'prodreg',required:true},
    costumer:{model:'costumer',required:true},
    value: {type: 'float',required: false},
    unitvalue: {type: 'float',required: false},
    amount: {type: 'integer',required:false},
    serviceRate: {type: 'integer',required:false},
    costumerRate: {type: 'integer',required:false},
    costumerComment:{type: 'string', required: true}
  }
};
