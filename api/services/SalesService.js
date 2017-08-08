
var Promise = require('bluebird');
var uuid = require('uuid');

module.exports =  {
  requestReceived: function (text,callback) {
    var query = "select s.id as sale_id, d.push_token, d.type, d.other from sale s "+
    "left join location l on l.id = s.location "+
    "left join device d on d.id = l.device "+
    "where s.createdAt >'2017-06-10' and s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_R_RECEIVED') limit 1;"

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
          if(res[0].other==='onesignal'){
            PushService.sendOneSignal(res[0].push_token,"37cec3b3-e337-4239-9e98-5eaa6f087038");
          }else{
            FacebookBot.send(res[0].push_token,"Feito! Recebemos seu pedido. Agora é só aguardar a confirmação do nosso entregador. Nós vamos te avisar por aqui.","received");
          }
          callback(result);
        })
      }
    })
    .catch(function (err) {
      sails.log.info('err->',err);
    })

  },
  requestAccepted:function (text,callback) {
    var query = "select s.id as sale_id, d.push_token, d.type, d.other from sale s "+
    "left join location l on l.id = s.location "+
    "left join device d on d.id = l.device "+
    "where s.aceptedAt is not null and s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_ACCEPTED') limit 1;"

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
          if(res[0].other==='onesignal'){
            PushService.sendOneSignal(res[0].push_token,"63dd0066-6400-4486-a482-c84aa397fff4");
          } else if(res[0].other==='facebook'){
            FacebookBot.send(res[0].push_token,"Seu pedido foi aceito. Já já sairá para entrega.","accepted");
          }else{
           PushService.send(res[0].push_token,res[0].type,{title:"Pedido Confirmado", message:"Seu pedido foi aceito por um de nossos entregadores. Calma aí que tá chegando."});
         }
         callback(result);
       })
      }
    })
    .catch(function (err) {
      sails.log.info('err->',err);
    })

  },

  driverOnWay:function (text,callback) {
    var query = "select s.id as sale_id, d.push_token, d.type, d.other, u.name as 'driver' from sale s "+
    "left join location l on l.id = s.location "+
    "left join device d on d.id = l.device "+
    "left join user u on u.id = s.user "+
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
          if(res[0].other==='onesignal'){
            PushService.sendOneSignal(res[0].push_token,"e086ddc0-493c-426c-ba0f-5e7039e4babf");
          }else if(res[0].other==='facebook'){
            FacebookBot.send(res[0].push_token,"Nosso entregador "+res[0].driver+" saiu para entregar seu pedido.","on_way");
          }else{
            PushService.send(res[0].push_token,res[0].type,{title:"Cerveja a caminho", message:"Sua cerveja gelada já está a caminho. Fica esperto aí!"});
          }
          callback(result);
        })
      }
    })
    .catch(function (err) {
      sails.log.info('err->',err);
    })

  },
  finishedSale:function (text,callback) {
    var query = "select s.id as sale_id, d.push_token, d.other from sale s "+
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
          if(res[0].other==='onesignal'){
            PushService.sendOneSignal(res[0].push_token,"ba403c5d-042c-42ff-9545-e44b2e8ddfe8");
          }else if(res[0].other==='facebook'){
            FacebookBot.send(res[0].push_token,"Sua cerveja foi entregue. Foi tudo bem com seu pedido? Avalie a experiência da sua entrega.");
          }else{
            PushService.send(res[0].push_token,res[0].type,{title:"Cerveja entregue", message:"Sua cerveja foi entregue. Foi tudo bem com seu pedido? Avalie a experiência da sua entrega."});
          }
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
    "where timediff( now(),s.createdAt) > '00:04:00' and s.aceptedAt is null "+
    "and s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_TELEGRAM') "+
    "order by s.createdAt limit 1;"


    var queryAssync = Promise.promisify(Sale.query);
    queryAssync(query)
    .then(function (res) {
      if(res.length > 0){
        var text=res[0];
        queryAssync("select count(*) as num from sale s left join prodreg pr on pr.id = s.prodreg where pr.zone = '"+text.zone+"'  and s.createdAt<(select createdAt from sale where id = '"+text.saleid+"');")
        .then(function (ped) {
          var pednum = parseInt(ped[0].num)+1;
          if(text.telegram && text.telegram!==''){

            return TelegramService.sendRequest(text,pednum)
            .then(function(response) {
              var not ={
                id:uuid.v4(),
                notification:"SALE_TELEGRAM",
                id_table:text.sale_id
              }
              return Notifications.create(not)
              .then(function (res) {
                callback(res);
              })

            });

          }else{
            var not ={
              id:uuid.v4(),
              notification:"SALE_TELEGRAM",
              id_table:text.sale_id
            }
            return Notifications.create(not)
            .then(function (res) {
              callback(res);
            })
          }
        })
      }else{
        callback();
      }

    })
    .catch(function (err) {
      sails.log.info('err->',err);
    })
  },
  sendSlack:function (text,callback) {
    var Promise = require('bluebird');

    var query = "select z.name as zone,s.id as saleid,s.payment as payment, s.address as fulladdress, c.name as name,z.slack as slack,z.telegram as telegram,c.phone as phone,c.email as email,c.facebook_id as facebook_id, p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id, l.lat as lat, l.long as lng, l.address as address "+
    "from sale s "+
    "left join `prodreg` pr on pr.id = s.prodreg "+
    "left join `zone` z on pr.zone = z.id "+
    "left join `product` p  on p.id  = pr.product "+
    "left join `costumer` c on c.id = s.costumer "+
    "left join `location` l on l.id = s.location "+
    "where s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_GENERAL') "+
    "order by s.createdAt limit 1;"


    var queryAssync = Promise.promisify(Sale.query);
    queryAssync(query)
    .then(function (res) {
      if(res.length){
        SlackService.send("order",res[0].amount+' '+res[0].proname+' em '+res[0].zone);
        var not ={
          id:uuid.v4(),
          notification:"SALE_GENERAL",
          id_table:res[0].sale_id
        }
        Notifications.create(not)
        .then(function (res) {
          callback(res);
        })
      }else{
        callback(res);
      }
    });
  },


  sendFeedbackSlack:function (text,callback) {
    var Promise = require('bluebird');

    var query = "select s.createdAt as day,s.costumerRate,s.serviceRate,s.costumerComment,timediff(s.finishedAt,s.createdAt) as time, z.name as zone,s.id as saleid,s.payment as payment, s.address as fulladdress, c.name as name,z.slack as slack,z.telegram as telegram,c.phone as phone,c.email as email,c.facebook_id as facebook_id, p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id, l.lat as lat, l.long as lng, l.address as address "+
    "from sale s "+
    "left join `prodreg` pr on pr.id = s.prodreg "+
    "left join `zone` z on pr.zone = z.id "+
    "left join `product` p  on p.id  = pr.product "+
    "left join `costumer` c on c.id = s.costumer "+
    "left join `location` l on l.id = s.location "+
    "where s.createdAt > '2017-04-01 00:00:00' and (s.serviceRate is not null or s.costumerComment is not null) and s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_FEEDBACK') "+
    "order by s.createdAt limit 1;"


    var queryAssync = Promise.promisify(Sale.query);
    queryAssync(query)
    .then(function (res) {
      if(res.length){
        rev = res[0];
        var text="*Cidade*:"+rev.zone+
        "\n*Pedido*:"+rev.amount+" de "+rev.proname+" = "+rev.value+
        "\n*Data*:"+rev.day+
        "\n*Cliente*:"+rev.name+
        "\n*Tempo*:"+rev.time+
        "\n*nota entregador*:"+rev.costumerRate+
        "\n*nota Cliente*:"+rev.serviceRate+
        "\n*comentario Cliente*:"+rev.costumerComment;


        SlackService.send("rating",text);
        var not ={
          id:uuid.v4(),
          notification:"SALE_FEEDBACK",
          id_table:res[0].sale_id
        }
        Notifications.create(not)
        .then(function (res) {
          callback(res);
        })
      }else{
        callback(res);
      }
    });
  }
}

