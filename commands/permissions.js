module.exports = {
	name: 'permissions',
	aliases: ['perms', 'permission'],
	description: 'Will return a list of permissions of the user(I there was a user mentioned) or the permission of the bot in the server/guild whos id was given',
	usage: '<@someone or id of server to check my permissions>',
	category: 'Info',
	args: true,
	args_num: 1,
	execute(message, args){
		let mention = args[0];
		if (!mention){
			try {
				return message.send(message.client.guilds.cache.get(args[0]).me.permissionsIn());
			}catch(err){
				console.error(err);
				return message.channel.send('That is an invalid server id or mention');
			}
		}

		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			message.channel.send(message.client.users.cache.get(mention));
		}
	},
};
