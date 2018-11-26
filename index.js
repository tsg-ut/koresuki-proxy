const fastify = require('fastify')();
const axios = require('axios');

require('dotenv').load();

fastify.post('/', async (request, reply) => {
  if (request.body.key !== process.env.KEY) {
    return {ok: false};
  }

  if (request.body.url !== undefined) {
    axios.post(process.env.SLACK_WEBHOOK, {
      channel: process.env.KORESUKI_CHANNEL,
      text: `これすき ${request.body.url}`,
      username: 'koresuki-bot',
      icon_emoji: process.env.KORESUKI_EMOJI,
      unfurl_links: true,
    });
    return {ok: true};
  }
  return {ok: false};
});

fastify.listen(process.env.PORT || 3000, '0.0.0.0');
