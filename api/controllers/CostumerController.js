/**
 * CostumerController
 *
 * @description :: Server-side logic for managing costumers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var uuid = require('node-uuid');
 var Promise = require('bluebird');
 module.exports = {
   create: function (req, res) {
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters: email name ');
    } else {
      var data = req.body;
      Device.findOne({id:data.device})
      .then(function (device) {
        if(device){
          data.device = device;
          data = Costumer.prepareData(data);
          Costumer.find({email:data.email})
          .then(function (emails) {
            if(emails.length){
              return res.json({err:'EMAIL_EXISTS'});
            }else{
              Costumer.create(data)
              .then(function (costumer) {
                var au = {
                  id:uuid.v4(),
                  device:device,
                  costumer:costumer,
                }
                Auth.create(au)
                .then(function (result) {
                  delete result.costumer.password;
                  delete result.costumer.device;
                  var r = {
                    token:result.id,
                    device:result.device,
                    costumer:au.costumer
                  }
                  return res.json(r);
                });
              })
              .catch(function(error) {
                res.status(500);
                return res.json(error);
              });
            }
          })
          .catch(function(error) {
            res.status(500);
            return res.json(error);
          });
        }
      })
    }
  },
  update: function (req, res) {
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters: email name ');
    } else {
      var data = req.body;
      Costumer.update({id:data.id},{phone:data.phone})
      .then(function (resp) {
        var u= resp[0];
        delete u.password;
        delete u.device;
        return res.json(u);
      })
      .catch(function (err) {
        console.log('err->',err);
        return res.json(err);
      })
    }
  },

  lastBuy: function (req, res) {
    Sale.findOne({costumer:req.params.id,serviceRate:null, finishedAt:{ '!': null }})
    .then(function (last) {
      if(last){
        return res.json(last);
      }else{
        return res.send();
      }
    })
    .catch(function (err) {
      return res.send();
    })
  },
  lastBuyOpen: function (req, res) {
    Sale.findOne({costumer:req.params.id,serviceRate:null, finishedAt:null}).populate('user')
    .then(function (last) {
      if(last){
        Prodreg.findOne({id:last.prodreg}).populate('product')
        .then(function (pr) {
          last.prodreg=pr;
          return res.json(last);
        });
      }else{
        return res.send();
      }
    })
    .catch(function (err) {
      return res.send();
    })
  }

}
