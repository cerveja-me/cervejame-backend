var FCM = require('fcm-node');

var serverKey = 'AAAAAmhFHUs:APA91bGFcnrgnRWSAqHZwAcmsPtlL8K5cogkR8Ge0VA58YXZG7SNijd-Fh6xH9o0yrsT0W30B6JLqnV4-nzXyPrSWTQb0AHOTiFIjq8fUjInAvGUJSO8PQfsmuOBWMteCf-i5URyZLML';
var fcm = new FCM(serverKey);

module.exports =  {
  send: function (to, data) {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: to,
      collapse_key: 'your_collapse_key',

      notification: {
        title: data.title,
        body: data.message
      },

    // data: {  //you can send only notification or only data(or include both)
    //     my_key: 'my value',
    //     my_another_key: 'my another value'
    // }
  };

  fcm.send(message, function(err, response){
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
}
}
