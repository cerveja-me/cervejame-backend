var accountSid = 'AC3035b2e6f7e10f24c63c188411370239';
var authToken = "5f4c1cfb5f45cbc49bc26051d342507b";
var client = require('twilio')(accountSid, authToken);

module.exports =  {
    call: function (number) {
        console.log('calling to -> ',number);
        client.calls.create({
            url: "https://delicious-spot-9578.twil.io/assets/voice.xml",
            to: number,
            from: "+5511930054332"
        }, function(err, call) {
            console.log('error->',err);
            console.log('call->',call);
        });
    }
}
