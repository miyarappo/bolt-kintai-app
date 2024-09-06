require("dotenv").config();

module.exports = {
  slackConfig: {
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
  },
  port: process.env.PORT || 3000,
};
