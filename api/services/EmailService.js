
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
var uuid = require('node-uuid');

var send = function (text,callback) {
  var requestify = require('requestify');
  var Promise = require('bluebird');

  var query = "select s.id as saleid, c.name as name,z.slack as slack,c.phone as phone,c.email as email,c.facebook_id as facebook_id, p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id, l.lat as lat, l.long as lng, l.address as address "+
  "from sale s "+
  "left join `prodreg` pr on pr.id = s.prodreg "+
  "left join `zone` z on pr.zone = z.id "+
  "left join `product` p  on p.id  = pr.product "+
  "left join `costumer` c on c.id = s.costumer "+
  "left join `location` l on l.id = s.location "+
  "where s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_RECEIVED') limit 1;"


  var queryAssync = Promise.promisify(Sale.query);
  queryAssync(query)
  .then(function (res) {
    var text=res[0];
    if(res.length > 0){
      return requestify.post(text.slack, {
        "text": " *Pedido*: "+text.amount+" cx de "+text.proname+" ("+text.price+") = R$ "+text.value+
        "\n*Nome*: "+text.name+
        " \n*Facebook*: <https://www.facebook.com/"+text.facebook_id+
        ">\n*endereço*: "+text.address+"\n*Fone*: "+text.phone+
        "\n*local*:<http://api.cerveja.me/sale/accept/"+text.saleid+">"
      })
      .then(function(response) {
        var not ={
          id:uuid.v4(),
          notification:"SALE_RECEIVED",
          id_table:text.sale_id
        }
        Notifications.create(not)
        .then(function (res) {
          callback(res);
        })
      });
    }else{
      callback();
    }

  })
  .catch(function (err) {
    sails.log.info('err->',err);
  })



};
module.exports =  {
  send: send
}
