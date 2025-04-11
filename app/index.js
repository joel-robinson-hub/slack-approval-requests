require('dotenv').config();
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Respond to app mentions
app.event('app_mention', async ({ event, say }) => {
  await say(`👋 Hey <@${event.user}>!`);
});

// Slash command example (register it in Slack too)
app.command('/approve', async ({ command, ack, respond }) => {
  await ack();
  await respond(`✅ Approval request received from <@${command.user_id}>.`);
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ App is running!');
})();
