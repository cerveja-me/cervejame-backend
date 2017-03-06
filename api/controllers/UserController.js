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
        delete user.password;
        delete user.device;
        return res.json(user);
    }else{
        return res.json({err:'WRONG_USER'})
    }
})
}

};

