module.exports = {
	name: 'give-role',
	aliases: ['add-role'],
	description: 'Gives the specified role to the specified user in the specified server/guild',
	usage: '<role name(case sensitive)> <user id> <server/guild id>',
	args: true,
	args_num: 3,
	category: 'Utility',
	private: true,
	execute(message, args){
		if(!parseInt(args[1]) || !parseInt(args[2])){
			return message.channel.send('Please make sure that the user id and server id are valid!');
		}
		const guildId = args[2];
		const memberId = args[1];
		const roleName = args[0];
		const role = message.client.guilds.cache.get(guildId).roles.cache.find(r => r.name == roleName);

		if(!message.client.guilds.cache.get(guildId).me.hasPermission('MANAGE_ROLES')){
			return message.channel.send('I am sorry but I don\'t have the neccesary permissions on the server you specified to give the user you specified a role');
		}

		message.client.guilds.cache.get(guildId).members.cache.get(memberId).roles.add(role)
			.then(r =>{
				message.channel.send(`Gave you the ${r.name} role!`);
			})
			.catch(err => {
				console.error(err);
				message.client.on('DiscordAPIError', error => {
					return message.channel.send('I am sorry but I don\'t have the neccesary permissions on the server you specified to give the user you specified a role');
				});
				throw new Error(err);
			});
	},
};
