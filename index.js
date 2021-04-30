require('dotenv').load();

const crypto = require('crypto');
const fastify = require('fastify')();
const axios = require('axios');
const {promisify} = require('util');

const keys = require('./keys.js');

fastify.post('/', async (request, reply) => {
  const user = Object.entries(keys).find(([, hash]) => (
    crypto.createHash('sha256').update(request.body.key, 'utf8').digest('hex') === hash
  ));

  if (user === undefined) {
    return {ok: false};
  }

  if (typeof request.body.url === 'string') {
    const url = request.body.url.trim();
    if (!url) {
      return {ok: false};
    }

    const {data: {members}} = await axios.post('https://slack.com/api/users.list', {
      limit: 1000,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      },
    });

    const member = members.find(({profile, real_name, name}) => (
      (profile && profile.display_name === user[0]) ||
      name === user[0] ||
      name === user[0]
    ));

    if (!member) {
      return {ok: false};
    }

    await axios.post('https://slack.com/api/chat.postMessage', {
      channel: process.env.KORESUKI_CHANNEL,
      text: `これすき ${url}`,
      username: `${user[0]} (koresuki-bot)`,
      icon_url: member.profile.image_72,
      unfurl_links: true,
      as_user: false,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      },
    });

    return {ok: true};
  }

  return {ok: false};
});

fastify.listen(process.env.PORT || 3000, '0.0.0.0');
