/**
 * SaleController
 *
 * @description :: Server-side logic for managing sales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var requestify = require('requestify');
 var Promise = require('bluebird');

 module.exports = {
   create: function (req, res) {
    if (!req.body) {
      return res.badRequest('you must pass all parameters');
    } else {
      var params = req.body;
      var s ={};
      s.location = params.location;
      s.address=params.address;
      s.payment=params.payment;
      s.amount = params.product.amount;
      Prodreg.findOne({id:params.product.id}).populate('product')
      .then(function (productreg) {
        s.prodreg=productreg;
        s.unitvalue = productreg.price;
        s.value = s.unitvalue * s.amount;
        Costumer.findOne({id:params.costumer})
        .then(function (cost) {
          s.costumer = cost;
          Sale.create(s)
          .then(function (saleRes) {
            return res.send(saleRes);
          }).catch(function (err) {
            console.log('err->',err);
          });
        });
      });
    }
  },
  acept:function (req,res) {
    console.log('entrou aqui->',req.params.id);
    Sale.update({id:req.params.id},{aceptedAt:new Date()})
    .then(function (result) {
      return res.send(result);
    })
  },
  onWay:function (req,res) {//remover após todos migrarem para o app
    Sale.update({id:req.params.id},{onWayAt:new Date()})
    .then(function (result) {
      Location.findOne({id:result[0].location})
      .then(function (local) {
        return res.send(''+
          '<a style="font-size: 106px;" href="http://waze.to/?ll='+local.lat+','+local.long+'&navigate=yes/">WAZE</a> <br><br>'+
          '<a style="font-size: 106px;" href="http://maps.google.com/maps?daddr='+local.lat+','+local.long+'&ll=">MAPS</a> <br><br>'+
          '<a style="font-size: 106px;" href="http://api.cerveja.me/sale/finished/'+req.params.id+'">CONCLUIR</a> <br>'
          );
      })

    });
  },
  onWayApp:function (req,res) {
    Sale.update({id:req.body.sale},{onWayAt:new Date(),user:req.body.user})
    .then(function (result) {
      return res.send(result[0]);
    });
  },
  finishSaleApp:function (req,res) {
    Sale.update({id:req.body.sale},{finishedAt:new Date(),costumerRate:req.body.rate,user:req.body.user})
    .then(function (result) {
      return res.send(result[0]);
    });
  },
  finished:function (req,res) {
    Sale.update({id:req.params.id},{finishedAt:new Date()})
    .then(function (result) {
      return res.send('<h1>AVALIAR CLIENTE</h1>'+
        '<a style="font-size: 106px;" href="http://api.cerveja.me/sale/finished/ratecostumer/'+req.params.id+'/1">NOTA 1</a> <br><br>'+
        '<a style="font-size: 106px;" href="http://api.cerveja.me/sale/finished/ratecostumer/'+req.params.id+'/2">NOTA 2</a> <br><br>'+
        '<a style="font-size: 106px;" href="http://api.cerveja.me/sale/finished/ratecostumer/'+req.params.id+'/3">NOTA 3</a> <br><br>'+
        '<a style="font-size: 106px;" href="http://api.cerveja.me/sale/finished/ratecostumer/'+req.params.id+'/4">NOTA 4</a> <br><br>'+
        '<a style="font-size: 106px;" href="http://api.cerveja.me/sale/finished/ratecostumer/'+req.params.id+'/5">NOTA 5</a> <br><br>'
        );
    });
  },
  costumerRate:function (req,res) {
    Sale.update({id:req.params.id},{finishedAt:new Date(),costumerRate:req.params.rate})
    .then(function (result) {
      return res.send('<h1>Concluido</h1>');
    });
  },
  sendfeedback:function (req, res) {
    Sale.update({id:req.body.id},{serviceRate:req.body.rate,costumerComment:req.body.comment})
    .then(function (result) {
      return res.send(result);
    });
  },

  getOpenSales:function (req,res) {
    var id = req.params.id;
    if(id){
      var query = "select time_to_sec(timediff(now(),s.createdAt))/60 as tempo, s.aceptedAt - interval 3 hour as aceptedAt,s.createdat - interval 3 hour as createdAt, s.onWayAt - interval 3 hour as onWayAt,s.finishedAt - interval 3 hour as finishedAt, s.costumerRate as rate,"+
      " s.id as saleid,s.payment as payment, s.address as fulladdress, c.name as name,c.phone as phone, p.name as proname,p.img as img, s.amount as amount,s.value as value,s.unitvalue as price, l.lat as lat, l.long as lng, l.address as address from sale s "+
      "left join costumer c on s.costumer =c.id "+
      "left join location l on s.location =l.id "+
      "left join prodreg pr on s.prodreg = pr.id "+
      "left join product p on pr.product = p.id "+
      " WHERE s.createdat > now() - interval 3 hour and "+
      " (s.onWayAt is null or s.finishedAt is null or s.costumerRate is null)"+
      " and s.prodreg in("+
      " select pr.id from prodreg pr where pr.zone =(select zone from user where id='"+id+"')) order by s.createdat;";
      var queryAssync = Promise.promisify(Sale.query);
      queryAssync(query)
      .then(function (data) {
        return res.send(data);
      })
    }else{
      return res.send();
    }
  },

  getOpenSalesAdmin:function (req,res) {
    var id = req.params.id;
    if(id){
      var query = "select time_to_sec(timediff(now(),s.createdAt))/60 as tempo, s.aceptedAt - interval 3 hour as aceptedAt,s.createdat - interval 3 hour as createdAt, s.onWayAt - interval 3 hour as onWayAt,s.finishedAt - interval 3 hour as finishedAt, s.costumerRate as rate,"+
      " s.id as saleid,s.payment as payment, s.address as fulladdress, c.name as name,c.phone as phone, p.name as proname,p.img as img, s.amount as amount,s.value as value,s.unitvalue as price, l.lat as lat, l.long as lng, l.address as address, z.name as zona from sale s "+
      "left join costumer c on s.costumer =c.id "+
      "left join location l on s.location =l.id "+
      "left join prodreg pr on s.prodreg = pr.id "+
      "left join zone z on z.id = pr.zone "+
      "left join product p on pr.product = p.id "+
      " WHERE s.createdAt > (now() - interval 1 day) and "+
      " (s.onWayAt is null or s.finishedAt is null or s.costumerRate is null) "+
      "order by s.createdAt";
      var queryAssync = Promise.promisify(Sale.query);
      queryAssync(query)
      .then(function (data) {
        return res.send(data);
      })
    }else{
      return res.send();
    }
  }

};

