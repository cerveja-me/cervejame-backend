// const http = require('http')
// const Bot = require('messenger-bot')

// let bot = new Bot({
//   token: 'EAAE07Qv9cYQBAHZC5olA8OuvrV4Fqy3jgUv284ezG4xSqxW6Jog9W8Wv3CRNw6AvtmxMPi6HeHGYVZCI4jFZCOzHC20JW60V4wyGtlkOGDnAkBU8LHTxZBJUti1kuMsprPekX1qq8x8ES4WnRCQFAhfTMWOEZCZBAxee65qHqxpAZDZD',
//   verify: 'cerveja_me_facebook_bot',
//   app_secret: '6f626bffba1e36d689daa8bef8717a0a'
// })

// bot.on('error', (err) => {
//   console.log(err.message)
// })

// bot.on('message', (payload, reply) => {
//   let text = payload.message.text

//   bot.getProfile(payload.sender.id, (err, profile) => {
//     if (err) throw err

//       reply({ text }, (err) => {
//         if (err) throw err

//           console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
//       })
//   })
// })

// http.createServer(bot.middleware()).listen(3000)
// console.log('Echo bot server running at port 3000.')
