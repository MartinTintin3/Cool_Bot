module.exports = {
	name: 'unban',
	description: 'Unban a user by the specified user id and server/guild id',
	usage: '<user id> <server/guild id>',
	args: true,
	args_num: 2,
	category: 'Utility',
	private: true,
	execute(message, args){
		message.client.guilds.cache.get(args[1]).members.unban(args[0])
			.then(user => console.log(`Unbanned ${user.username} from ${message.client.guilds.cache.get(args[1]).name}`))
			.catch(console.error);
	},
};
