/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
   create: function (req, res) {
    // console.log('reqqq->>>',req.body);
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters: email name ');
    } else {
      Device.findOne({push_token:req.body.push_token})
      .then(function (device) {
        if(device){
          Device.update({id:device.id},{id:device.id})
          .then(function (result) {
            return res.json(result[0]);
          })
        }else{
          var data = Device.prepareData(req.body);
          Device.create(data)
          .then(function(result) {
            return res.json(result);
          })
          .catch(function(error) {
            res.status(500);
            return res.json(error);
          });
        }
      });
    }
  },
};
