/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

 module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  '/*': function(req, res, next) {console.log(req.method, req.url); next();},
  '/': {
    view: 'homepage'
  },
  'post /auth/login' : 'AuthController.login',
  'post /auth/user' : 'UserController.login',
  'get /sale/openSales/:id':'SaleController.getOpenSales',
  'get /sale/openSalesAdmin/:id':'SaleController.getOpenSalesAdmin',
  'post /costumer/update':'CostumerController.update',
  'get /costumer/lastbuy/:id': 'CostumerController.lastBuy',
  'get /costumer/lastbuyOpen/:id': 'CostumerController.lastBuyOpen',
  'post /sale/sendfeedback':'SaleController.sendfeedback',
  'post /device/sendMessage':'DeviceController.pushMessage', //deprecated
  'post /sale/onway':'SaleController.onWayApp',
  'post /sale/arrived':'SaleController.arrivedApp',
  'post /sale/finish':'SaleController.finishSaleApp',
  'get /bot':'AuthController.botResponse',
  'post /bot':'AuthController.botResponse',
  'get /auth': {view: 'homepage'},
  'get /costumer': {view: 'homepage'},
  'get /device': {view: 'homepage'},
  'get /location': {view: 'homepage'},
  'get /notification': {view: 'homepage'},
  'get /prodreg': {view: 'homepage'},
  'get /product': {view: 'homepage'},
  'get /sale': {view: 'homepage'},
  'get /zone': {view: 'homepage'},
  'get /voucher': {view: 'homepage'},
  'post /voucher/validate':'VoucherController.validate',
  'post /voucher':{view: 'homepage'},
  'post /voucher/create':'VoucherController.create',
  'get /proddetails/:id':'ProdregController.getDetails',
  'get /prodreg/:zone': 'ProdregController.getAvailableProducts', //seller produtos
  'post /prodreg/updateStatus':'ProdregController.updateStatus', //ativar e desativar
  //v2
  'post /v2/device':'DeviceController.createV2',
  'get /sale/acc/:id':'SaleController.acept',


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
