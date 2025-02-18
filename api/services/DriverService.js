var uuid = require('uuid');
// var telegram = require('TelegramService');

module.exports = {
  send: function (text, callback) {
    var requestify = require('requestify');
    var Promise = require('bluebird');

    var query = "select pr.zone as zone,s.id as saleid,s.payment as payment, s.address as fulladdress, c.name as name,z.slack as slack,z.telegram as telegram,c.phone as phone,c.email as email,c.facebook_id as facebook_id, p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id, l.lat as lat, l.long as lng, l.address as address " +
      "from sale s " +
      "left join `prodreg` pr on pr.id = s.prodreg " +
      "left join `zone` z on pr.zone = z.id " +
      "left join `product` p  on p.id  = pr.product " +
      "left join `costumer` c on c.id = s.costumer " +
      "left join `location` l on l.id = s.location " +
      "where s.id not in (select n.id_table from `notifications` n where n.notification ='SALE_RECEIVED') limit 1;"


    var queryAssync = Promise.promisify(Sale.query);
    queryAssync(query)
      .then(function (res) {
        var text = res[0];
        if (res.length > 0) {
          var msgfu = " *Pedido*: " + text.amount + " cx de " + text.proname + " (" + text.price + ") = R$ " + text.value +
            "\n*Nome*: " + text.name +
            " \n*Facebook*: <https://www.facebook.com/" + text.facebook_id +
            ">\n*endereço*: " + (text.fulladdress !== null ? text.fulladdress : text.address) +
            "\n*Fone*: " + text.phone +
            "\n*PAGAMENTO*: " + (text.payment === 'card' ? 'CARTÃO' : 'DINHEIRO');


          return requestify.post(text.slack, {"text": msgfu})
            .then(function (response) {
              var not = {
                id: uuid.v4(),
                notification: "SALE_RECEIVED",
                id_table: text.sale_id
              };
              Notifications.create(not)
                .then(function (res) {
                  requestify.post(text.slack, {"text": text.phone});
                  callback(res);
                });
            });
        } else {
          callback();
        }

      })
      .catch(function (err) {
        sails.log.info('err->', err);
      });
  },
  sendAppNotification: function (text, callback) {
    var requestify = require('requestify');
    var Promise = require('bluebird');

    var query = "select u.push as push,u.device as device, pr.zone as zone,s.id as saleid," +
      "s.payment as payment, s.address as fulladdress, c.name as name," +
      "p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id " +
      "from user u " +
      "left join `zone` z on u.zone = z.id " +
      "left join `prodreg` pr on pr.zone = z.id " +
      "left join `sale` s on s.prodreg = pr.id " +
      "left join `costumer` c on c.id = s.costumer " +
      "left join `product` p on p.id = pr.product " +
      "where s.id=(select id from sale where id not in (select n.id_table from `notifications` n " +
      "where n.notification ='SALE_RECEIVED_APP') " +
      "order by createdAt desc  limit 1);"


    var queryAssync = Promise.promisify(Sale.query);

    queryAssync(query)
      .then(function (res) {
        var text = res[0];
        if (res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            text = res[i];
            var data = {
              title: 'Pedido',
              message: text.amount + ' cx de ' + text.proname + ' - ' + text.name
            };
            if (text.push) {
              DeliverPushService.send(text.push, text.device, data);
            }
            var not = {
              id: uuid.v4(),
              notification: "SALE_RECEIVED_APP",
              id_table: text.sale_id
            };
            Notifications.create(not)
              .then(function (res) {
                callback(res);
              });
          }

        }
      });
  },
  sendAppNotificationTwoMinutesNoAcept: function (text, callback) {
    var requestify = require('requestify');
    var Promise = require('bluebird');

    var query = "select u.push as push,u.device as device, pr.zone as zone,s.id as saleid," +
      "s.payment as payment, s.address as fulladdress, c.name as name," +
      "p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id " +
      "from user u " +
      "left join `zone` z on u.zone = z.id " +
      "left join `prodreg` pr on pr.zone = z.id " +
      "left join `sale` s on s.prodreg = pr.id " +
      "left join `costumer` c on c.id = s.costumer " +
      "left join `product` p on p.id = pr.product " +
      "where timediff( now(),s.createdAt) > '00:00:30' and s.aceptedAt is null" +
      " AND s.id=(select id from sale where id not in (select n.id_table from `notifications` n where n.notification ='SALE_RECEIVED_APP_TWO') " +
      "order by createdAt desc  limit 1);"


    var queryAssync = Promise.promisify(Sale.query);

    queryAssync(query)
      .then(function (res) {
        var text = res[0];
        if (res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            text = res[i];
            var data = {
              title: 'Pedido',
              message: text.amount + ' cx de ' + text.proname + ' - ' + text.name
            };
            if (text.push) {
              DeliverPushService.send(text.push, text.device, data);
            }
            var not = {
              id: uuid.v4(),
              notification: "SALE_RECEIVED_APP_TWO",
              id_table: text.sale_id
            };
            Notifications.create(not)
              .then(function (res) {
                callback(res);
              });
          }
        }
      });
  },

  callToAdmin: function (text, callback) {
    var Promise = require('bluebird');

    var query = "select u.phone,u.device as device, pr.zone as zone,s.id as saleid," +
      "s.payment as payment, s.address as fulladdress, c.name as name," +
      "p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id " +
      "from user u " +
      "left join `zone` z on u.id = z.admin " +
      "left join `prodreg` pr on pr.zone = z.id " +
      "left join `sale` s on s.prodreg = pr.id " +
      "left join `costumer` c on c.id = s.costumer " +
      "left join `product` p on p.id = pr.product " +
      "where timediff( now(),s.createdAt) > '00:05:00' and s.aceptedAt is null" +
      " AND s.createdAt>'2017-06-13' AND s.id not in (select n.id_table from `notifications` n where n.notification ='CALLED_FIVE_MINUTES') limit 1";

    var queryAssync = Promise.promisify(Sale.query);

    queryAssync(query)
      .then(function (res) {
        var text = res[0];
        if (res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            text = res[i];
            TwilioService.call(text.phone);
            var not = {
              id: uuid.v4(),
              notification: "CALLED_FIVE_MINUTES",
              id_table: text.sale_id
            };
            Notifications.create(not)
              .then(function (res) {
                callback(res);
              });
          }
        }
      });
  },

  sendAppNotificationFiveMinutesNoAcept: function (text, callback) {
    var requestify = require('requestify');
    var Promise = require('bluebird');

    var query = "select u.push as push,u.device as device, pr.zone as zone,s.id as saleid," +
      "s.payment as payment, s.address as fulladdress, c.name as name," +
      "p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id " +
      "from user u " +
      "left join `zone` z on u.zone = z.id " +
      "left join `prodreg` pr on pr.zone = z.id " +
      "left join `sale` s on s.prodreg = pr.id " +
      "left join `costumer` c on c.id = s.costumer " +
      "left join `product` p on p.id = pr.product " +
      "where timediff( now(),s.createdAt) > '00:01:00' and s.aceptedAt is null" +
      " AND s.id=(select id from sale where id not in (select n.id_table from `notifications` n where n.notification ='SALE_RECEIVED_APP_FIVE') " +
      "order by createdAt desc  limit 1);";


    var queryAssync = Promise.promisify(Sale.query);

    queryAssync(query)
      .then(function (res) {
        var text = res[0];
        if (res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            text = res[i];
            var data = {
              title: 'Pedido',
              message: text.amount + ' cx de ' + text.proname + ' - ' + text.name
            };
            if (text.push) {
              DeliverPushService.send(text.push, text.device, data);
            }
            var not = {
              id: uuid.v4(),
              notification: "SALE_RECEIVED_APP_FIVE",
              id_table: text.sale_id
            };
            Notifications.create(not)
              .then(function (res) {
                callback(res);
              });
          }
        }
      });
  },
  sendAppNotificationTenMinutesNoAcept: function (text, callback) {
    var requestify = require('requestify');
    var Promise = require('bluebird');

    var query = "select u.push as push,u.device as device, pr.zone as zone,s.id as saleid," +
      "s.payment as payment, s.address as fulladdress, c.name as name," +
      "p.name as proname, s.amount as amount,s.value as value,s.unitvalue as price, s.id as sale_id " +
      "from user u " +
      "left join `zone` z on u.zone = z.id " +
      "left join `prodreg` pr on pr.zone = z.id " +
      "left join `sale` s on s.prodreg = pr.id " +
      "left join `costumer` c on c.id = s.costumer " +
      "left join `product` p on p.id = pr.product " +
      "where timediff( now(),s.createdAt) > '00:03:00' and s.aceptedAt is null" +
      " AND s.id=(select id from sale where id not in (select n.id_table from `notifications` n where n.notification ='SALE_RECEIVED_APP_TEN') " +
      "order by createdAt desc  limit 1);"


    var queryAssync = Promise.promisify(Sale.query);

    queryAssync(query)
      .then(function (res) {
        var text = res[0];
        if (res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            text = res[i];
            var data = {
              title: 'Pedido',
              message: text.amount + ' cx de ' + text.proname + ' - ' + text.name
            };
            if (text.push) {
              DeliverPushService.send(text.push, text.device, data);
            }
            var not = {
              id: uuid.v4(),
              notification: "SALE_RECEIVED_APP_TEN",
              id_table: text.sale_id
            };
            Notifications.create(not)
              .then(function (res) {
                callback(res);
              });
          }
        }
      });
  },
  sendMonthReport: function (text, callback) {
    var requestify = require('requestify');
    var Promise = require('bluebird');

    var query = "select s.createdAt - interval 3 hour as createdat, s.finishedAt - interval 3 hour as finishedat, timediff(s.finishedAt,s.createdAt) as 'time', " +
      "c.name as costumer,p.name as product, p.description as description, s.unitvalue as unitvalue, s.amount as amount, s.value as value from sale s " +
      "left join prodreg pr on pr.id=s.prodreg " +
      "left join product p on p.id = pr.product " +
      "left join costumer c on c.id= s.costumer "

    "where pr.zone = '499dfe43-7712-438d-85bf-888b98c7c717' order by s.createdAt;"


    var queryAssync = Promise.promisify(Sale.query);

    queryAssync(query)
      .then(function (res) {
        EmailService.sendMonthReport({
          type: 'monthReport',
          subject: 'relatorio Mensal de vendas',
          from: 'contas@cerveja.me',
          to: 'jeferson@guardezi.com',
          name: 'Jeferson',
          orders: res
        });
        callback();
      });

  }
};
