require('dotenv').config();
const { App, ExpressReceiver } = require('@slack/bolt');
const bodyParser = require('body-parser');

// Create custom receiver
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Must parse JSON BEFORE anything else
receiver.router.use(bodyParser.json());

// Intercept Slack's initial verification request
receiver.router.post('/slack/events', (req, res, next) => {
  console.log('➡️ POST /slack/events');
  console.log('📦 Body:', req.body);

  if (req.body && req.body.type === 'url_verification') {
    console.log('✅ Responding to Slack challenge');
    return res.status(200).send(req.body.challenge);
  }

  next(); // Let Bolt handle other events
});

// Optional: Root health check
receiver.router.get('/', (req, res) => {
  res.send('Slack bot is alive ✅');
});

// Initialize Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});

// Bolt event: @mention
app.event('app_mention', async ({ event, say }) => {
  await say(`👋 Hey <@${event.user}>!`);
});

// Slash command: /approve
app.command('/approve', async ({ command, ack, respond }) => {
  await ack();
  await respond(`✅ Approval request received from <@${command.user_id}>.`);
});

// Start server
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ App is running!');
})();
