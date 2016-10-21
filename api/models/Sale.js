/**
 * Sale.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var uuid = require('node-uuid');
 var Q = require('q');

 module.exports = {

  attributes: {
    id: { type: 'string', required: true,  primaryKey: true ,defaultsTo:function() {return uuid.v4();} },
    location:{model:'location',required:true},
    payment:{type: 'string', required: true},
    finishedAt:{type:'datetime', required:false},
    value: {type: 'float',required: false},
  },

  mapProducts:function (products) {
    return Q.Promisse(function(resolve, reject) {
      resolve(products);
    });
  },
  prepareData: function(params) {
    var s = {};
    s.location = params.location;
    s.payment=params.payment;
    this.mapProducts(params.products)
    .then(function (products) {
      s.products= products;
    });
    // s.products = params.products.map(function (prodReg) {
    //   console.log("prod->",prodReg);
    //   Prodreg.findOne({id:prodReg.id}).populate('product')
    //   .then(function (prod) {
    //     console.log("prod->",prod,"finalPrice->", prod.price*prodReg.amount);
    //     return prod;
    //   })
    //   .catch(function (err) {
    //     throw new TypeError(' this is null or not defined');
    //   })
    // },function (argument) {
    //   console.log("aaa: ",argument);
    // })

    return s;
  },
};
