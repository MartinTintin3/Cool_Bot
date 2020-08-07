const { invite_link } = require('../config.json');

module.exports = {
	name: 'invite-bot',
	aliases: ['invitebot', 'inv-bot', 'invite', 'bot-invite'],
	description: 'If you are a server admin and have the power to invite bots, then use this command to invite me! I will need to be able to administrate so I can delete bad words and other things!',
	category: 'Utility',
	execute(message, args) {
		message.channel.send(`**Here is the invite link:**\n${invite_link}`);
	},
};
