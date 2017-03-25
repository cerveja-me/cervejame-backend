var FCM = require('fcm-node');

var serverKey = 'AAAAdXnNU4g:APA91bHMh2g4Z72vC7SNtHq0q4X0la9tgQBzx4NP2vk3SeQCKJJNRNgy1XbGp3dNpjMi0AL4hzz_aDeAaA-Jm8wcuTg0UQhldDC7w6c3es-FXWe2do52W30OKru1VBm-tRymSdpRuzvC';
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
      body: data.message,
      sound: "ringtone"
    }
  }else{
    message.notification={
      title: data.title,
      body: data.message,
      sound: "default"
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
