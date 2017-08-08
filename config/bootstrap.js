/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
 var scheduler = require('node-schedule');

 module.exports.bootstrap = function(cb) {
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  var emailService = EmailService;
  var salesService = SalesService;
  var minuteJob  = scheduler.scheduleJob('*/5 * * * * *', function(){
    DriverService.sendAppNotification("enviar notificacao para o entregador",function (err, result) {});
    // DriverService.sendMonthReport("Random text",function (err, result) {}); //mover para evento mensal
    DriverService.sendAppNotificationTwoMinutesNoAcept("30 segundos sem resposta",function (err, result) {});
    DriverService.sendAppNotificationFiveMinutesNoAcept("1 minutos sem resposta",function (err, result) {});
    DriverService.sendAppNotificationTenMinutesNoAcept("3 minutos sem resposta",function (err, result) {});
    DriverService.callToAdmin("Liga pro caboclo se nao responder em 5 minutos",function (err,result) {});
    // SalesService.requestReceived("o pedido foi aceito(visualizado)",function (err,result) {});
    // SalesService.requestAccepted("o pedido foi aceito(visualizado)",function (err,result) {});
    // SalesService.driverOnWay("entrega a caminho",function (err,result) {});
    // SalesService.finishedSale("venda finalizada",function (err,result) {});
    SalesService.sendTelegram("notificar o telegram",function (err,result) {});
    SalesService.sendSlack("notificar o telegram",function (err,result) {});
    SalesService.sendFeedbackSlack("notificar o telegram",function (err,result) {});
  });
  cb();
};
