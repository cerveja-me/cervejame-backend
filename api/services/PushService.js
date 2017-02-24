var FCM = require('fcm-node');

var serverKey = 'AAAAAmhFHUs:APA91bGFcnrgnRWSAqHZwAcmsPtlL8K5cogkR8Ge0VA58YXZG7SNijd-Fh6xH9o0yrsT0W30B6JLqnV4-nzXyPrSWTQb0AHOTiFIjq8fUjInAvGUJSO8PQfsmuOBWMteCf-i5URyZLML';
var fcm = new FCM(serverKey);

module.exports =  {
  send: function (to, device,data) {

    var message={};
    if(Array.isArray(to)){
      message={
        registration_ids:to
      }
    }else{
     message= {
      to: to
    }
  }
  if(device==='android'){
    message.data={
      title: data.title,
      body: data.message
    }
  }else{
    message.notification={
      title: data.title,
      body: data.message
    }
  }
    //envia a notificação
    fcm.send(message, function(err, response){
      console.log('err->',err, 'response->',response);
      if (err) {
        console.log("Something has gone wrong!");
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });
  }
}
