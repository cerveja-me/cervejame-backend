var FCM = require('fcm-node');

var serverKey = 'AAAAdXnNU4g:APA91bHMh2g4Z72vC7SNtHq0q4X0la9tgQBzx4NP2vk3SeQCKJJNRNgy1XbGp3dNpjMi0AL4hzz_aDeAaA-Jm8wcuTg0UQhldDC7w6c3es-FXWe2do52W30OKru1VBm-tRymSdpRuzvC';
var fcm = new FCM(serverKey);

var $onesignal = require('onesignal-plus').$instance;

$onesignal.setup({api_key: 'MmQwMTNjZTQtNGRlOC00NTQ4LWIzMjgtOWY3MDQyMWRjOWQ1'});

module.exports =  {
  send: function (to, device,message) {
    console.log('enviar para -> ',device,message);
    if(device=='onesignal'){
      this.sendOneSignal(to,device,message);
    }else{
      this.sendOld(to,device,message);
    }
  },
  sendOld: function (to, device,data) {

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
    fcm.send(message, function(err, response){});
  },
  sendOneSignal: function (to, device, message) {
    $onesignal.post('notifications',
    {
      app_id:"2c98ff23-918f-4620-939c-ebae678da341",
      headings: {en: 'Pedido'},
      contents: {en: message},
      include_player_ids: [to]
    }, function (errors, data) {
      console.log(errors, data);
    });
  }

}
