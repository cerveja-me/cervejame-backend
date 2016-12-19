/**
 * SaleController
 *
 * @description :: Server-side logic for managing sales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
   create: function (req, res) {
    if (!req.body) {
      return res.badRequest('you must pass all parameters');
    } else {

      var params = req.body;
      var s ={};
      s.location = params.location;
      s.payment=params.payment;
      s.amount = params.product.amount;
      Prodreg.findOne({id:params.product.id}).populate('product')
      .then(function (productreg) {
        s.prodreg=productreg;
        s.unitvalue = productreg.price;
        s.value = s.unitvalue * s.amount;
        Costumer.findOne({id:params.costumer})
        .then(function (cost) {
          s.costumer = cost;
          Sale.create(s)
          .then(function (saleRes) {
            return res.send(saleRes);
          }).catch(function (err) {
            console.log('err->',err);
          });
        });
      });
    }
  },
  accept:function (req,res) {
    Sale.update({id:req.params.id},{aceptedAt:new Date()})
    .then(function (result) {
      return res.send(result[0]);
    })
  },
  onWay:function (req,res) {
    Sale.update({id:req.params.id},{onWayAt:new Date()})
    .then(function (result) {
      return res.send(result[0]);
    })
  },
  finished:function (req,res) {
    Sale.update({id:req.params.id},{finishedAt:new Date()})
    .then(function (result) {
      return res.send(result[0]);
    })
  }
};

