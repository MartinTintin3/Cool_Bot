module.exports = {
	name: 'server',
	description: 'Will return the name of the server(`message.guild.name`) and the member count(`message.guild.memberCount`)',
	guildOnly: true,
	cooldown: 3,
	category: 'Info',
	execute(message, args) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},
};
