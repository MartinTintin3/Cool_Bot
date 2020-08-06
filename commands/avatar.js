module.exports = {
	name: 'avatar',
	description: 'Will return your avatar, or will return the avatar of all the people mentioned',
	cooldown: 5,
	usage: '<optional @mention> <optional @mention> etc...',
	aliases: ['icon', 'pfp'],
	category: 'Info',
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: <${user.displayAvatarURL({ format: 'png', dynamic: true })}>`;
		});

		message.channel.send(avatarList);
	},
};
