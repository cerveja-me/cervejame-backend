/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var Promise = require('bluebird');

 module.exports = {
  createV2:function (req,res) {
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters: email name ');
    }else{
      var d=req.body
      Device.findOrCreate({id:d.id},d)
      .then(function (device) {
        console.log('device->',device);
        if(d.push_token==='empty'){
          delete d.push_token;
        }
        Device.update({id:d.id},d)
        .then(function (n) {
          console.log('atualizado->',n);
        })
      })
    }
    console.log(req.body);
    return res.json(req.body);
  },
  create: function (req, res) {
    // console.log('reqqq->>>',req.body);
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters: email name ');
    } else {
      Device.findOne({push_token:req.body.push_token})
      .then(function (device) {
        if(device){
          Device.update({id:device.id},{id:device.id,type:req.body.type})
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
  pushMessage(req,res){
    var sentdata={ios:0,android:0};
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters: email name ');
    } else {
      var data = req.body;
      var deviceQueryAsync = Promise.promisify(Device.query);
      var query="select push_token, `type` from device where id in ("+
      "select distinct(device) from location "+
      " where (type <>'android' OR type is null ) "
      if(data.zone){
        query=query+"AND zone='"+data.zone+"');"
      }else{
        query=query+');'
      }
      deviceQueryAsync(query)
      .then(function (iosPush) {
        tokens=iosPush.map(function (tk) {
          return tk.push_token;
        });

        PushService.send(tokens,'ios',data);
        sentdata.ios=iosPush.length;
        query="select push_token, `type` from device where id in ("+
        "select distinct(device) from location "+
        " where type ='android' "
        if(data.zone){
          query=query+"AND zone='"+data.zone+"');"
        }else{
          query=query+');'
        }
        deviceQueryAsync(query)
        .then(function (androidPush) {

          tokens=androidPush.map(function (tk) {
            return tk.push_token;
          });
          PushService.send(tokens,'android',data);

          sentdata.android=androidPush.length;
          return res.json(sentdata);
        })
      });
    }
  }
};
