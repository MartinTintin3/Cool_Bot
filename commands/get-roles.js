module.exports = {
	name: 'get-roles',
	aliases: ['list-roles', 'roles'],
	description: 'Get a list in the specified server/guild',
	category: 'Info',
	usage: '<server/guild id>',
	private: true,
	args: true,
	args_num: 1,
	execute(message, args){
		const roles = new Map();
		message.client.guilds.cache.get(args[0]).roles.cache.each(role => {
			roles.set(role.name, role.position);
		});

		roles[Symbol.iterator] = function* () {
			yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
		};

		let data = '';
		for (const [key] of roles) { // get data sorted
			data += `${key}\n`;
		}
		return message.channel.send(data);
	},
};
