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
  }
};

