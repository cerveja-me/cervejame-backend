/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 var uuid = require('node-uuid');

 module.exports = {
  autoPK: false,
  attributes: {
   id: { type: 'string', required: true,  primaryKey: true  },
   name: { type: 'string', required: true },
   description: { type: 'string', required: true },
   img:{ type: 'string', required: true },
   price : {type: 'float',required: true},
   sku:{ type: 'string', required: false },
   cold: {type: 'boolean',required: false, defaultsTo: true},
 },
 prepareData: function(params) {
  var p = {};
  p.id = uuid.v4();
  p.name = params.name;
  p.description = params.description;
  p.img = params.img;
  p.price = params.price;
  p.sku  = params.sku;
  return p;
}
};

