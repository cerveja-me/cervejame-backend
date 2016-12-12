/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var uuid = require('node-uuid');

 module.exports = {
   login:function (req,res) {
    var data  = req.body
    Costumer.findOne({email:data.email, password:data.password})
    .then(function (user) {
      if(user){
        delete user.password;
        delete user.device;
        Device.findOne({id:data.device})
        .then(function (d) {
          var a={
            id:uuid.v4(),
            device:d,
            costumer:user
          }
          Auth.create(a)
          .then(function (result) {
            var r = {
              token:result.id,
              device:result.device,
              costumer:user
            }
            return res.json(r);
          });
        })
      }else{
        return res.json({err:'WRONG_USER'})
      }

    })
  }
};

