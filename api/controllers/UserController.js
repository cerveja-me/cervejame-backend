/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
   login:function (req,res) {
    var data  = req.body
    User.findOne({email:data.email, password:data.password})
    .then(function (user) {

        if(user){
            User.update({id:user.id},{device:data.device,push:data.push})
            .then(function (u) {
                var us= u[0];
                delete us.password;
                delete us.device;
                delete us.push;
                return res.json(us);
            });

        }else{
            return res.json({err:'WRONG_USER'})
        }
    })
}

};

