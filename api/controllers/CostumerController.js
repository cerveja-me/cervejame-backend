/**
 * CostumerController
 *
 * @description :: Server-side logic for managing costumers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var Promise = require('bluebird');
 module.exports = {
   create: function (req, res) {
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters: email name ');
    } else {
      var data = req.body;
      if(data.id){
        Costumer.update({id:data.id},{phone:data.phone})
        .then(function (result) {
          return res.json(result[0]);
        })
      }else{
        Device.findOne({id:data.device})
        .then(function (device) {
          if(device){
            data.device = device;
            data = Costumer.prepareData(data);
            Costumer.create(data)
            .then(function (costumer) {
              return res.json(costumer);
            })
            .catch(function(error) {
              res.status(500);
              return res.json(error);
            });
          }else{
            res.status(500);
            return res.json('device error');
          }
        })
        .catch(function(error) {
          res.status(500);
          return res.json(error);
        });
      }
    }
  },
}
