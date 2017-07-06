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
  },
  getDetails: function (req, res) {
    Prodreg.findOne({id:req.params.id}).populate('product')
    .then(pr=>{
      return res.json(pr);
    })
  },
  getAvailableProducts: function (req, res) {
    Prodreg.find({where:{zone:req.params.zone},sort:'active DESC'})
    .populate('product')
    .then(function (products) {
      return res.json(products);
    })
  },
  updateStatus: function (req, res) {
    if (!req.body) {
      return res.badRequest('you must pass all parameters');
    } else{
      // console.log('update->',req.body);
      Prodreg.update({id:req.body.id},{active:req.body.active})
      .then(function (result) {
        return res.send(result);
      })
      .catch(function (err) {
        // console.log('err-> ',err);
      })
    }
  }
}

