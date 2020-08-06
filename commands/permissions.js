module.exports = {
	name: 'permissions',
	aliases: ['perms', 'perm'],
	description: 'Check if the bot has the specified permission in the specified server/guild',
	usage: '<permission flag> <server/guild id>',
	category: 'Info',
	private: true,
	execute(message, args){
		const permissions = [
			'ADMINISTRATOR',
			'CREATE_INSTANT_INVITE',
			'KICK_MEMBERS',
			'BAN_MEMBERS',
			'MANAGE_CHANNELS',
			'MANAGE_GUILD',
			'ADD_REACTIONS',
			'VIEW_AUDIT_LOG',
			'VIEW_CHANNEL',
			'READ_MESSAGES',
			'SEND_MESSAGES',
			'SEND_TTS_MESSAGES',
			'MANAGE_MESSAGES',
			'EMBED_LINKS',
			'ATTACH_FILES',
			'READ_MESSAGE_HISTORY',
			'MENTION_EVERYONE',
			'USE_EXTERNAL_EMOJIS',
			'EXTERNAL_EMOJIS',
			'CONNECT',
			'SPEAK',
			'MUTE_MEMBERS',
			'DEAFEN_MEMBERS',
			'MOVE_MEMBERS',
			'USE_VAD',
			'CHANGE_NICKNAME',
			'MANAGE_NICKNAMES',
			'MANAGE_ROLES',
			'MANAGE_ROLES_OR_PERMISSIONS',
			'MANAGE_WEBHOOKS',
			'MANAGE_EMOJIS',
		];
		if(!permissions.includes(message.content.split(' ')[2].toUpperCase())){
			return message.channel.send('Invalid flag');
		}
		return message.channel.send(message.client.guilds.cache.get(message.content.split(' ')[1]).me.hasPermission(message.content.split(' ')[2].toUpperCase()));
	},
};
