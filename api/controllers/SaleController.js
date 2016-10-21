/**
 * SaleController
 *
 * @description :: Server-side logic for managing sales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
   create: function (req, res) {
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters');
    } else {
      var sale = Sale.prepareData(req.body);
      return res.json(sale);

    }
  }
};

