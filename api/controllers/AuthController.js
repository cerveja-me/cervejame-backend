/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var uuid = require('uuid');

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
  },
  botResponse:function (req,res) {
    console.log('req->',req);
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'cerveja_me_facebook_bot') {
      console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
}
};

