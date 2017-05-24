const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'EAAEHirZBZAS58BACGltHCG9ApZB2TXqnqflEKBFbHt4lMjvRFrjkFQfS3oP4HSciyC9a4RfLUc1BUVO6HuCmkd7IqT7QDm4tZA3LPZAFIS9UhQPrPgjqsCMcAbNHRX0xlVsnxwPzxXkbn7eoPSIWW04e54wlih0tbY67O2O4zIwZDZD',
  verify: 'cerveja_me_facebook_bot',
  app_secret: '542a29c7ca35a5ea33d8bb2e1816bf2a'
})
location = function (payload, reply) {
    reply({ "attachment": {
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
        {
            "title":"Welcome to Peter\'s Hats",
            "image_url":"https://petersfancybrownhats.com/company_image.png",
            "subtitle":"We\'ve got the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://peterssendreceiveapp.ngrok.io/view?item=103",
              "messenger_extensions": true,
              "webview_height_ratio": "tall",
              "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
          },
          "buttons":[
          {
            "type":"web_url",
            "url":"https://petersfancybrownhats.com",
            "title":"View Website"
        },{
            "type":"postback",
            "title":"Start Chatting",
            "payload":"DEVELOPER_DEFINED_PAYLOAD"
        }
        ]
    }
    ]
}}
}, (err, info) => {
    if(err){
        console.log('errou',err);
    }
})
}

bot.on('error', (err) => {
  console.log('error->',err.message);
})

bot.on('message', (payload, reply) => {
    if(payload.message.attachments){
        var attac=payload.message.attachments[0];
        console.log('tem algo');
        console.log('algo->',payload.message.attachments[0].type);
        if(attac.type==='location'){
            location(payload,reply);

        }

    }else{
        let text = payload.message.text
        console.log('text->',payload);

        bot.getProfile(payload.sender.id, (err, profile) => {
            if (err) throw err

                reply(
                {
                    "attachment":{
                      "type":"template",
                      "payload":{
                        "template_type":"button",
                        "text":"olá, o que vc quer?",
                        "buttons":[
                        {
                            "type":"web_url",
                            "url":"http://cerveja.me",
                            "title":"Ir para o site"
                        },
                        {
                            "type":"postback",
                            "title":"Pedir uma Cerveja",
                            "payload":"ORDER_BEER"
                        }
                        ]
                    }
                }
            }, (err) => {
                if (err) throw err

                  console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
          })
        })
    }

})
bot.on('pedir', (payload, reply, actions) => {
    console.log('pedir->',payload);
    reply({ text: 'hey!'}, (err, info) => {})
})

bot.on('postback', (payload, reply, actions) => {
    if(payload.postback.payload==='ORDER_BEER'){
        console.log('postback->',payload);
        reply({
            "text":"Please share your location:",
            "quick_replies":[
            {
                "content_type":"LOCATION"
            }
            ]
        }, (err, info) => {
            if(err) console.log('erro->',err);
        })
    }else{
        console.log('postback->',payload);
        reply({ text: 'hey!'}, (err, info) => {})
    }

})

bot.on('delivery', (payload, reply, actions) => {
  reply({ text: 'hey!'}, (err, info) => {})
})

http.createServer(bot.middleware()).listen(3000)
console.log('Echo bot server running at port 3000.')
