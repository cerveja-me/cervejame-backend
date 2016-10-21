/**
 * Saleproducts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = {

  attributes: {
    id: { type: 'string', required: true,  primaryKey: true ,defaultsTo:function() {return uuid.v4();} },
    prodreg:{model:'prodreg',required:true},
    sale:{model:'sale',required:true},
    amount:{type: 'integer', required: true},
    price: {type: 'float',required: false},
    price_total: {type: 'float',required: false},
  },
  prepareData:function (data) {
    var sp = {};

    return sp;
  }
};

