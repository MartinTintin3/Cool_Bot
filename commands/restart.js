const { owner_info } = require('../config.json');

module.exports = {
	name: 'restart',
	description: 'This will restart the bot',
	category: 'Utility',
	execute(message, args) {
		if(message.author.id != owner_info.id){
			return message.reply(`The bot can only be restarted by the owner of the bot(\`@${owner_info.tag}\`)`);
		}

		message.reply('Bot is restarting...').then(a => {
			process.exit();
		});
	},
};
