
// var sendgrid  = require('sendgrid')('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');
// var ejs = require('ejs')

// module.exports = {
//   sendConfirmationEmail: function(options) {
//     sails.hooks.views.render('mailTemplates/welcomeMail',options,function (err,html) {
//       if(err){
//         console.log('error->', err);
//       }else{
//         return sendgrid.send({
//           to:       options.email,
//           from:     'welcome@geltz.com.br',
//           subject:  'Bem vindo a GELTZ',
//           html:     html
//         }, function(err, json) {
//           if (err) { return console.error(err); }
//           Notification.create({type:'email',table:'user',id_on_table:options.id,notification:'welcome_email'})
//           .then(function fun_success(user) {
//             // console.log('userupdate->',user);
//           })
//           .catch(function funError(err) {
//             console.log('err',err);
//           })
//         });
//       }
//     })



//   },
//   sendCommandResumeEmail: function(options) {
//     console.log('nem entrou');
//     var text='Olá '+options.name+',\n'
//     +'\nAqui esta o recibo.'
//     +'\n \n Local: '+options.place
//     +''
//     return Comand_status.find({command:options.id})
//     .then(function statusCommand(status) {
//       console.log('status->', status);
//     });
//     console.log(options);
//     // text= text.concat
//     // sendgrid.send({
//     //   to:       options.email,
//     //   from:     'recibosSP@geltz.com.br',
//     //   subject:  'Recibos Geltz',
//     //   text:     'Olá '+options.name+',\n'+
//     //             '\nAqui esta o recibo.';
//     //
//     // }, function(err, json) {
//     //   if (err) { return console.error(err); }
//     //   console.log(json);
//     // });
//   }
// };
/**
 * Created by gkatzioura on 6/20/16.
 */
 var send = function (text,callback) {
  sails.log.info("Should send text: "+text)
  callback();
};
module.exports =  {
  send: send
}
