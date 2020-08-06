module.exports = {
	name: 'ping',
	description: 'Will return "Pong"',
	category: 'Fun',
	execute(message, args) {
		message.channel.send('Pong');
	},
};
