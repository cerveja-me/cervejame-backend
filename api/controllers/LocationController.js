/**
 * LocationController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');

module.exports = {
  create: function (req, res) {
    if (!req.body) {
      return res.badRequest('you must pass all parameters: email name ');
    }
    var data = Location.prepareData(req.body);
    Device.findOne({id: data.device})
      .then(function (device) {
        data.device = device;
        var zoneQueryAsync = Promise.promisify(Zone.query);

        zoneQueryAsync("select * from zone " +
          "where cast(`latNorth` AS DECIMAL(10,7)) > ? " +
          "and ? > cast(`latSouth` AS DECIMAL(10,7)) " +
          "and cast(`longNorth` AS DECIMAL(10,7)) < ? " +
          "and ? < cast(`longSouth` AS DECIMAL(10,7)) " +
          "and active =  true;", [data.lat, data.lat, data.long, data.long])
          .then(function (zones) {
            data.zone = zones[0];
            Location.create(data)
              .then(function (location) {
                if (location.zone) {
                  location.schedule = zones[0].schedule;
                  location.zonename = zones[0].name;
                  location.timezone = zones[0].time;
                  Prodreg.find({where: {zone: data.zone.id, active: true}, sort: 'priority ASC'})
                    .populate('product')
                    .then(function (products) {
                      location.products = products;
                      return res.json(location);
                    })
                    .catch(function (error) {
                      res.status(500);
                      return res.json(error);
                    });
                } else {
                  return res.json(location);
                }
              })
              .catch(function (error) {
                res.status(500);
                return res.json(error);
              });
          })
          .catch(function (error) {
            res.status(500);
            return res.json(error);
          });
      })
      .catch(function (error) {
        res.status(500);
        return res.json(error);
      });
  }
};
