const fastify = require('fastify')();
const axios = require('axios');

require('dotenv').load();

fastify.post('/', async (request, reply) => {
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

console.log('process.env', process.env);
fastify.listen(process.env.PORT || 3000).then(() => {
  console.log('fastify.server.address()', fastify.server.address());
});
