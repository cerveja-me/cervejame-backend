var requestify = require('requestify');
var slack = {
  order: "https://hooks.slack.com/services/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",
  rating: "https://hooks.slack.com/services/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"
}
module.exports = {
  send: function (type, data) {
    // console.log(slack[type],data);

    return requestify.post(slack[type], {"text": data});
  }
};
