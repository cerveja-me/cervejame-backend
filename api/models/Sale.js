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

  mapProducts:function (products,pos) {
    console.log('n-oi');
    return Q(function(resolve, reject) {
      if(pos<products.length-1){
        console.log('n-oi');
        mapProducts(products,pos++)
        .then(function (res) {
          products=res;
          resolve(products);
        })
      }else{
        console.log('oi');
        Prodreg.findOne({id:products[pos].id}).populate('product')
        .then(function (prod) {
          products[pos]=prod;
          resolve(products);
        });
      }
    })
  },
  prepareData: function(params) {
    return Q(function(resolve, reject) {
      console.log('oi');
      var s = {};
      s.location = params.location;
      s.payment=params.payment;
      Sale.mapProducts(params.products,0)
      .then(function (products) {
        s.products= products;
        resolve(s);
      });
    });
  },
};
