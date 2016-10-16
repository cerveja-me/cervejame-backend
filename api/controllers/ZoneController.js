/**
 * ZoneController
 *
 * @description :: Server-side logic for managing zones
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
   create: function (req, res) {
    if (!req.body) {
      return res.badRequest( 'you must pass all parameters');
    } else {
      var data = Zone.prepareData(req.body);
      Zone.create(data)
      .then(function(result) {
        return res.json(result);
      })
      .catch(function(error) {
        res.status(500);
        return res.json(error);
      });
    }
  }
};

