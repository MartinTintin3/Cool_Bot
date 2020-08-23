module.exports = {
	name: 'delete-message',
	description: 'Deletes message in the specified server/guild and channel id by id',
	category: 'Utility',
	private: true,
	args: true,
	usage: '<guild/server id> <channel id> <message id>',
	args_num: 3,
	execute(message, args){
		if(!message.client.guilds.cache.get(args[0]).channels.cache.get(args[1]).messages.fetch(args[2]).then(a => a.content).content) return message.channel.send('Unknown Message');
		message.client.guilds.cache.get(args[0]).channels.cache.get(args[1]).messages.fetch(args[2])
			.then(m => {
				m.delete();
			})
			.catch(console.error);
	},
};
