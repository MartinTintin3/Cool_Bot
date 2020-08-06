module.exports = {
	name: 'args-info',
	description: 'Will return the value of the first argument. If the argument is "foo", then the bot will return "bar"',
	args: true,
	usage: '<argument(e.g. foo)>',
	category: 'Info',
	execute(message, args) {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};
