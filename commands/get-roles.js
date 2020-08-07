module.exports = {
	name: 'get-roles',
	aliases: ['list-roles'],
	description: 'Get a list in the specified server/guild',
	category: 'Info',
	usage: '<server/guild id>',
	private: true,
	args: true,
	args_num: 1,
	execute(message, args){
		const roles = new Map();
		console.log(JSON.stringify(message.client.guilds.cache.get(args[0]).roles.cache));
		return message.channel.send(data.sort((a, b) => a - b));
	},
};
