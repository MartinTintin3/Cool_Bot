const { bot_info } = require('../config.json');

module.exports = {
	name: 'get-servers',
	aliases: ['get-guilds'],
	description: `Returns a list of all the guilds/servers the ${bot_info.name}`,
	category: 'Info',
	private: true,
	execute(message, args){
		message.client.guilds.cache.each(guild => console.log(guild.name));
		let data = '';
		message.client.guilds.cache.each(guild => data += `"${guild.name}" : ${guild.id}\n`);
		return message.channel.send(data);
	},
};
