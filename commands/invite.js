module.exports = {
	name: 'create-invite',
	aliases: ['invite', 'inv', 'create-inv'],
	args: true,
	description: 'Will create and invite for the specified server/guild to the specified channel by id. If provided the keyword "new" after the server/guild id, then the invite will be a unique one. This is useful if the person who is going to use the invite has just been unbanned.',
	usage: '<server/guild id> <channel id> <optional keyword "new" to get a unique invite>',
	category: 'Utility',
	private: true,
	execute(message, args){
		if(!parseInt(args[0])){
			return message.channel.send('Please provide a valid server/guild id');
		}else if(!parseInt(args[1])){
			return message.channel.send('Please provide a valid channel id');
		}
		message.client.guilds.cache.get(args[0]).channels.cache.get(args[1]).createInvite({unique: args[2] == 'new'})
			.then(invite => {
				return message.channel.send(`Here is the invite link: ${invite.url}`);
			}).catch(console.error);
	},
};
