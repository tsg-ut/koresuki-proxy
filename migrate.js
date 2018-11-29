const Redis = require('redis');
const {promisify} = require('util');

const redis = Redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');

(async () => {
	const entries = [
		['http://soundcloud.com/ujico/pixelgalaxy', '1543512247.023400'],
		['http://soundcloud.com/ut_underveil/silentroom-afterglow', '1543511669.023200'],
	];

	for (const [url, ts] of entries) {
		await promisify(redis.set).bind(redis)(url, ts);
	}

	redis.end(true);
})();
