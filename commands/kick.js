module.exports = {
	name: 'kick',
	description: 'Kick the user by the mention or by their id. **Make sure you don\'t mention anyone else in the message or the person who also got mentioned might get banned**',
	usage: '<@user or user id> <reason for kicking(Optional)>',
	category: 'Moderation',
	args: true,
	execute(message, args){
		if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You need the Ban Members permission');
		if(!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send(`I need the Ban Members permission. Please contact "${message.guild.owner.user.tag}" and tell them to give me the Ban Members permission`);
		console.log(message.mentions);
	},
};
