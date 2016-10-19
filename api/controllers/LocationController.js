/**
 * LocationController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
  create: function (req, res) {
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters: email name ');
    } else {
      var data = Location.prepareData(req.body);
      Device.findOne({id:data.device})
      .then(function (device) {
        data.device=device;
        /* Apos migrar vamos usar uma busca dentro do mysql com uma estimativa de tempo*/
        Zone.find({id: '81bb17e0-2542-4531-a0d8-b0dc2128590c'})
        .then(function (zones) {
          data.zone=zones[0];
          Location.create(data)
          .then(function(result) {
            Prodreg.find({zone:data.zone.id}).populate('product')
            .then(function (products) {
              return res.json(products);
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
          res.status(500);
          return res.json(error);
        });
      })
      .catch(function(error) {
        res.status(500);
        return res.json(error);
      });
    }
  }
};
