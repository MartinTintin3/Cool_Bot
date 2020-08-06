const { bot_info } = require('./package.json');

module.exports = {
	name: 'version',
	description: 'Returns the bot version',
	category: 'Info',
	execute(message, args) {
		message.channel.send(`Bot Version: ${bot_info.version}`);
	},
};
