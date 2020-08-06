module.exports = {
	name: 'get-channels',
	aliases: ['list-channels', 'channels'],
	description: 'Get a list of channels and channel id\'s in the specified server/guild',
	usage: '<server/guild id>',
	category: 'Info',
	args: true,
	args_num: 1,
	private: true,
	execute(message, args){
		let data = '';
		message.client.guilds.cache.get(args[0]).channels.cache.each(channel => {
			if(data.split('').length < 1600){
				data += `"${channel.name}": ${channel.id}\n`;
			}
		});
		return message.channel.send(data);
	},
};
