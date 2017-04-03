
var helper = require('sendgrid').mail;

var ejs = require('ejs')

module.exports = {
  sendMonthReport: function(options) {
    sails.hooks.views.render(options.type,options,function (err,html) {
      if(err){
        console.log('error->', err);
      }else{
        from_email = new helper.Email(options.from);
        to_email = new helper.Email(options.to);
        subject = options.subject;
        content = new helper.Content("text/html", html);
        mail = new helper.Mail(from_email, subject, to_email, content);
        mail = new helper.Mail(from_email, subject, to_email, content);

        var sg = require('sendgrid')('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');
        var request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });
        sg.API(request, function(error, response) {
          console.log(response.statusCode);
          console.log(response.body);
          console.log(response.headers);
        })

      }
    })

  }
};

// from_email = new helper.Email("test@example.com");
// to_email = new helper.Email("test@example.com");
// subject = "Sending with SendGrid is Fun";
// content = new helper.Content("text/plain", "and easy to do anywhere, even with Node.js");
// mail = new helper.Mail(from_email, subject, to_email, content);

// var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
// var request = sg.emptyRequest({
//   method: 'POST',
//   path: '/v3/mail/send',
//   body: mail.toJSON()
// });

// sg.API(request, function(error, response) {
//   console.log(response.statusCode);
//   console.log(response.body);
//   console.log(response.headers);
// })
