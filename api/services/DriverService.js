
var uuid = require('node-uuid');
// var telegram = require('TelegramService');

module.exports =  {
  send : function (text,callback) {
    var requestify = require('requestify');
    var Promise = require('bluebird');

    var query = "select pr.zone as zone,s.id as saleid,s.payment as payment, s.address as fulladdress, c.name as name,z.slack as slack,z.telegram as telegram,c.phone as phone,c.email as email,c.facebook_id as facebook_id, p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id, l.lat as lat, l.long as lng, l.address as address "+
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
        var msgfu =  " *Pedido*: "+text.amount+" cx de "+text.proname+" ("+text.price+") = R$ "+text.value+
        "\n*Nome*: "+text.name+
        " \n*Facebook*: <https://www.facebook.com/"+text.facebook_id+
        ">\n*endereço*: "+(text.fulladdress!==null?text.fulladdress:text.address)+
        "\n*Fone*: "+text.phone+
        "\n*PAGAMENTO*: "+(text.payment==='card'?'CARTÃO':'DINHEIRO');


        return requestify.post(text.slack, {"text":msgfu})
        .then(function(response) {
          var not ={
            id:uuid.v4(),
            notification:"SALE_RECEIVED",
            id_table:text.sale_id
          }
          Notifications.create(not)
          .then(function (res) {
            requestify.post(text.slack, {"text": text.phone});
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
  },
  sendAppNotification : function (text,callback) {
    var requestify = require('requestify');
    var Promise = require('bluebird');

    var query = "select u.push as push,u.device as device, pr.zone as zone,s.id as saleid,"+
    "s.payment as payment, s.address as fulladdress, c.name as name,"+
    "p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id "+
    "from user u "+
    "left join `zone` z on u.zone = z.id "+
    "left join `prodreg` pr on pr.zone = z.id "+
    "left join `sale` s on s.prodreg = pr.id "+
    "left join `costumer` c on c.id = s.costumer "+
    "left join `product` p on p.id = pr.product "+
    "where s.id=(select id from sale where id not in (select n.id_table from `notifications` n "+
    "where n.notification ='SALE_RECEIVED_APP') "+
    "order by createdAt desc  limit 1);"


    var queryAssync = Promise.promisify(Sale.query);

    queryAssync(query)
    .then(function (res) {
      var text=res[0];
      if(res.length > 0){
        for (i = 0; i < res.length; i++) {
          text=res[i];
          var data = {
            title:'Pedido',
            message:text.amount +' cx de '+text.proname+' - '+text.name
          }
          if(text.push){
            DeliverPushService.send(text.push,text.device, data);
          }
          var not ={
            id:uuid.v4(),
            notification:"SALE_RECEIVED_APP",
            id_table:text.sale_id
          }
          Notifications.create(not)
          .then(function (res) {
            callback(res);
          })
        };
      }
    });
  }

};
