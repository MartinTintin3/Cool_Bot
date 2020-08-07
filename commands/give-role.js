module.exports = {
	name: 'give-role',
	aliases: ['add-role'],
	description: 'Gives the specified role to the specified user in the specified server/guild',
	usage: '<role name(case sensitive)> <user id> <server/guild id>',
	args: true,
	category: 'Utility',
	private: true,
	execute(message, args){
		let guildId;
		let memberId;
		let roleName;
		if(!parseInt(args[1])){
			roleName = `${args[0]} ${args[1]}`;
			guildId = args[3];
			memberId = args[2];
		}else if(!parseInt(args[2])){
			roleName = `${args[0]} ${args[1]} ${args[2]}`;
			guildId = args[4];
			memberId = args[3];
		}else{
			roleName = args[0];
			guildId = args[2];
			memberId = args[1];
		}
		const role = message.client.guilds.cache.get(guildId).roles.cache.find(r => r.name == roleName);

		if(!message.client.guilds.cache.get(guildId).me.hasPermission('MANAGE_ROLES')){
			return message.channel.send('I am sorry but I don\'t have the neccesary permissions on the server you specified to give the user you specified a role');
		}

		message.client.guilds.cache.get(guildId).members.cache.get(memberId).roles.add(role)
			.then(r =>{
				message.channel.send(`Gave you the ${roleName} role!`);
			})
			.catch(err => {
				console.error(err);
				return message.channel.send('I am sorry but I don\'t have the neccesary permissions on the server you specified to give the user you specified a role');
			});
	},
};
