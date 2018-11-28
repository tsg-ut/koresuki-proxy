require('dotenv').load();

const crypto = require('crypto');
const fastify = require('fastify')();
const axios = require('axios');

const keys = require('./keys.js');

fastify.post('/', async (request, reply) => {
  const user = Object.entries(keys).find(([, hash]) => (
    crypto.createHash('sha256').update(request.body.key, 'utf8').digest('hex') === hash
  ));

  if (user === undefined) {
    return {ok: false};
  }

  if (typeof request.body.url === 'string') {
    await axios.post(process.env.SLACK_WEBHOOK, {
      channel: process.env.KORESUKI_CHANNEL,
      text: `これすき ${request.body.url}`,
      username: `${user[0]} (koresuki-bot)`,
      icon_emoji: `:${user[0]}:`,
      unfurl_links: true,
    });
    return {ok: true};
  }

  return {ok: false};
});

fastify.listen(process.env.PORT || 3000, '0.0.0.0');
