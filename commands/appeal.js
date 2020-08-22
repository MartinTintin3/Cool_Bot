module.exports = {
	name: 'appeal',
	description: 'If you have been banned from this server then run this command and the moderators will consider revoking your ban if the reason is good',
	usage: '<reason to unban>',
	category: 'Utility',
	args: true,
	execute(message, args){
		if(message.channel.type != 'dm') return message.channel.send('This command can only be run inside dms');
		let bannedUser;
		message.client.guilds.cache.get('730054736530636841').fetchBans().then(bans => {
			bannedUser = bans.find(user => user.id == message.author.id);
		});

		if(bannedUser){
			return message.client.guilds.cache.get('730054736530636841').channels.cache.get('730124141583270009').send({ embed: {
				color: 0xff0000,
				title: 'Ban Appeal',
				fields: [
					{
						name: 'User:',
						value: message.author.tag,
					},
					{
						name: 'Reason:',
						value: args.join(' '),
					},
				],
			}});
		}else{
			return message.channel.send('You are not banned');
		}
	},
};