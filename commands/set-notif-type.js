module.exports = {
	name: 'set-notif-type',
	description: 'Set defualt notification type',
	category: 'Utility',
	usage: '<server/guild id> <Notifcation settings. e.g. All or MENTIONS>',
	private: true,
	args: true,
	args_num: 2,
	execute(message, args){
		if(!message.client.guilds.cache.get(args[0])) return message.channel.send('Invalid server/guild id');
		if(!message.client.guilds.cache.get(args[0]).me.hasPermission('MANAGE_GUILD')) return message.channel.send('I don\'t have the neccessary permissions')
		message.client.guilds.cache.get(args[0]).setDefaultMessageNotifications(args[1])
			.then(guild => {
				return message.channel.send(`Successfully changed defualt server notification setting for ${guild.name} to ${args[1].toUpperCase()}`);
			})
			.catch(console.err);
	},
};
