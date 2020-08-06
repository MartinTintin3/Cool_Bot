module.exports = {
	name: 'beep',
	description: 'Will return "Boop"',
	category: 'Fun',
	execute(message, args) {
		message.channel.send('Boop');
	},
};
