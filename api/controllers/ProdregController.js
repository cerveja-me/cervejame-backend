/**
 * ProdregController
 *
 * @description :: Server-side logic for managing prodregs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
   create: function (req, res) {
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters');
    } else {
      var data = req.body;
      Zone.findOne({id:data.zone})
      .then(function(zone){
        data.zone = zone;
        Product.findOne({id:data.product})
        .then(function(product){
          data.product = product;
          Prodreg.create(Prodreg.prepareData(data))
          .then(function(result) {
            return res.json(result);
          })
          .catch(function(error) {
            res.status(500);
            return res.json(error);
          });
        })
        .catch(function(error) {
          res.status(500);
          return res.json(error);
        });
      })
      .catch(function(error) {
        console.log('err->',error, data);
        res.status(500);
        return res.json(error);
      });
    }
  }
}

