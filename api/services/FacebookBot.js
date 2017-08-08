


var requestify = require('requestify');

var url ='';
if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
  url = 'http://localhost:5000/sendnotification';
}else{
  url = 'https://dc10c4c0.ngrok.io/sendnotification';
}

module.exports =  {
  send:function (id,message,status) {
    console.log('enviar $s para %s',message, id);
    return requestify.post(url, { "to":id, "message":message,"status":status});
  }
}
