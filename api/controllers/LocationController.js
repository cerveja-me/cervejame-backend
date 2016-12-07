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
        Zone.find({ where: { latNorth: { '<': data.lat },latSouth :{ '>': data.lat },
          longNorth:{ '>': data.long},longSouth:{ '<': data.long},active:true } })
        .then(function (zones) {
          data.zone=zones[0];
          Location.create(data)
          .then(function(location) {
            if(location.zone){
              Prodreg.find({zone:data.zone.id}).populate('product')
              .then(function (products) {
                location.products = products;
                return res.json(location);
              })
              .catch(function(error) {
                res.status(500);
                return res.json(error);
              });
            }else{
              return res.json(location);
            }
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
