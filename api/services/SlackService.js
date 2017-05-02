var requestify = require('requestify');
var slack = "https://hooks.slack.com/services/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";
module.exports =  {
    send: function (data) {
        // console.log(data);
        return requestify.post(slack, { "text":data});
    }
}
