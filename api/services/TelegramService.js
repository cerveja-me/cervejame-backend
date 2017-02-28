const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '277128655:AAEFfvSI22Oe7V-LXFSrffCHmgVlvjKPvEA';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log('msg->',msg);
  console.log('id',msg.chat.id);

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'ok');
});

module.exports =  {
    sendMessage:function (chat, msg) {
        return bot.sendMessage(chat,msg,{parse_mode:'Markdown'});
    },
    sendRequest:function (text,num) {
        console.log('zone->',text.zone);
        var msgfu ="*ped n: "+num +"*"+
        "\n*ITEM*: "+text.amount+" cx de "+text.proname+" ("+text.price+") = R$ "+text.value+
        "\n*Nome*: "+text.name+
        "\n*FB*: https://www.facebook.com/"+text.facebook_id+
        "\n*END*: "+(text.fulladdress!==null?text.fulladdress:text.address)+
        "\n*Fone*: "+text.phone+
        "\n*PAG*: "+(text.payment==='card'?'CARTÃO':'DINHEIRO 💰')+
        "\n*Local*: http://api.cerveja.me/sale/accept/"+text.saleid;
        return this.sendMessage(text.telegram, msgfu);
    }
}
