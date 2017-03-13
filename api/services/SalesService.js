
var Promise = require('bluebird');
var uuid = require('node-uuid');

module.exports =  {
  requestReceived: function (text,callback) {
    var query = "select s.id as sale_id, d.push_token, d.type from sale s "+
    "left join location l on l.id = s.location "+
    "left join device d on d.id = l.device "+
    "where s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_R_RECEIVED') limit 1;"

    var queryAssync = Promise.promisify(Sale.query);
    queryAssync(query)
    .then(function (res) {
      if(res.length > 0){
        var not ={
          id:uuid.v4(),
          notification:"SALE_R_RECEIVED",
          id_table:res[0].sale_id
        }
        Notifications.create(not)
        .then(function (result) {
          PushService.send(res[0].push_token,res[0].type,{title:"Pedido Recebido", message:"Recebemos o seu pedido. Aguarde a confirmação do entregador."});
          callback(result);
        })
      }
    })
    .catch(function (err) {
      sails.log.info('err->',err);
    })

  },
  requestAccepted:function (text,callback) {
    var query = "select s.id as sale_id, d.push_token, d.type from sale s "+
    "left join location l on l.id = s.location "+
    "left join device d on d.id = l.device "+
    "where s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_ACCEPTED') limit 1;"

    var queryAssync = Promise.promisify(Sale.query);
    queryAssync(query)
    .then(function (res) {
      if(res.length > 0){
        var not ={
          id:uuid.v4(),
          notification:"SALE_ACCEPTED",
          id_table:res[0].sale_id
        }
        Notifications.create(not)
        .then(function (result) {
          PushService.send(res[0].push_token,res[0].type,{title:"Pedido Confirmado", message:"Seu pedido foi aceito por um de nossos entregadores. Calma aí que tá chegando."});
          callback(result);
        })
      }
    })
    .catch(function (err) {
      sails.log.info('err->',err);
    })

  },

  driverOnWay:function (text,callback) {
    var query = "select s.id as sale_id, d.push_token, d.type from sale s "+
    "left join location l on l.id = s.location "+
    "left join device d on d.id = l.device "+
    "where  s.onWayAt < (now()- interval 10 second) and " +
    "s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_ONWAY') limit 1;"

    var queryAssync = Promise.promisify(Sale.query);
    queryAssync(query)
    .then(function (res) {
      if(res.length > 0){
        var not ={
          id:uuid.v4(),
          notification:"SALE_ONWAY",
          id_table:res[0].sale_id
        }
        Notifications.create(not)
        .then(function (result) {
          PushService.send(res[0].push_token,res[0].type,{title:"Cerveja a caminho", message:"Sua cerveja gelada já está a caminho. Fica esperto aí!"});
          callback(result);
        })
      }
    })
    .catch(function (err) {
      sails.log.info('err->',err);
    })

  },
  finishedSale:function (text,callback) {
    var query = "select s.id as sale_id, d.push_token from sale s "+
    "left join location l on l.id = s.location "+
    "left join device d on d.id = l.device "+
    "where  s.finishedAt < (now()- interval 90 second) and " +
    "s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_FINISHED') limit 1;"

    var queryAssync = Promise.promisify(Sale.query);
    queryAssync(query)
    .then(function (res) {
      if(res.length > 0){
        var not ={
          id:uuid.v4(),
          notification:"SALE_FINISHED",
          id_table:res[0].sale_id
        }
        Notifications.create(not)
        .then(function (result) {
          PushService.send(res[0].push_token,res[0].type,{title:"Cerveja entregue", message:"Sua cerveja foi entregue. Foi tudo bem com seu pedido? Avalie a experiência da sua entrega."});
          callback(result);
        })
      }
    })
    .catch(function (err) {
      sails.log.info('err->',err);
    })

  },
  sendTelegram:function (text,callback) {
    var Promise = require('bluebird');

    var query = "select pr.zone as zone,s.id as saleid,s.payment as payment, s.address as fulladdress, c.name as name,z.slack as slack,z.telegram as telegram,c.phone as phone,c.email as email,c.facebook_id as facebook_id, p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id, l.lat as lat, l.long as lng, l.address as address "+
    "from sale s "+
    "left join `prodreg` pr on pr.id = s.prodreg "+
    "left join `zone` z on pr.zone = z.id "+
    "left join `product` p  on p.id  = pr.product "+
    "left join `costumer` c on c.id = s.costumer "+
    "left join `location` l on l.id = s.location "+
    "where s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_TELEGRAM') order by s.createdAt limit 1;"


    var queryAssync = Promise.promisify(Sale.query);
    queryAssync(query)
    .then(function (res) {
      if(res.length > 0){
        var text=res[0];
        queryAssync("select count(*) as num from sale s left join prodreg pr on pr.id = s.prodreg where pr.zone = '"+text.zone+"'  and s.createdAt<(select createdAt from sale where id = '"+text.saleid+"');")
        .then(function (ped) {
          var pednum = parseInt(ped[0].num)+1;

          return TelegramService.sendRequest(text,pednum)
          .then(function(response) {
            var not ={
              id:uuid.v4(),
              notification:"SALE_TELEGRAM",
              id_table:text.sale_id
            }
            Notifications.create(not)
            .then(function (res) {
              callback(res);
            })
          });
        })
      }else{
        callback();
      }

    })
    .catch(function (err) {
      sails.log.info('err->',err);
    })
  }
}

