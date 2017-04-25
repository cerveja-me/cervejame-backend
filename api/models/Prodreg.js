/**
 * Prodreg.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var uuid = require('node-uuid');

 module.exports = {
  autoPK: false,
  attributes: {
    id: { type: 'string', required: true,  primaryKey: true  },
    zone:{model:'zone',required:true},
    product:{model:'product',required:true},
    price : {type: 'float',required: true},
    priority:{type: 'integer',required:false},
    active: {type: 'boolean',required: false, defaultsTo: true},
  },
  prepareData: function(params) {
    var pr = {};
    pr.id = uuid.v4();
    pr.product = params.product;
    pr.zone = params.zone;
    pr.price = params.price;

    return pr;
  }

};

