const { prefix } = require('../config.json');

module.exports = {
	name: 'ban',
	description: `Ban the user specified and if provided ban them for a duration in days. If not provided, will be banned forever. For example to ban a user named JonBoi for 15 minutes because of spam, you could do: \`${prefix}ban 15 @JonBoi spam\`. **Do NOT mention a second user when writing the reason because they might get banned instead**`,
	usage: '<optional time in days. Skip for infinite> @<the user that is getting banned> <optional reason>',
	category: 'Moderation',
	args: true,
	guildOnly: true,
	execute(message, args){
		if(!message.guild.me.hasPermission('BAN_MEMBERS')){
			if(message.guild.owner.nickname.length){
				return message.channel.send(`I don't have the Ban Members permission. Please contact \`${message.guild.owner.nickname}\``);
			}else{
				return message.channel.send(`I don't have the Ban Members permission. Please contact \`${message.guild.owner.user.tag}\``);
			}
		}
		if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You don\'t have the Ban Members permission. Don\'t even try!');

		const member = message.mentions.members.first();
		if(!member) return message.reply('Please mention a valid member of this server');
		if(!member.bannable) return message.reply('I cannot ban this user! Do they have a higher role?');

		let reason;
		if(parseInt(args[0])){
			reason = args.slice(2).join(' ');
		}else{
			reason = args.slice(1).join(' ');
		}

		if(!reason) reason = 'No reason provided';

		if(parseInt(args[0])){
			member.ban({ days: parseInt(args[0]), reason: reason }).then(m => {
				message.guild.owner.send(`\`${m.displayName}\` has been banned from \`${message.guild.name}\` because of \`${reason}\` by \`${message.author.tag}\` for ${args[0]} days`);
				return message.channel.send(`\`${m.displayName}\` has been banned because of \`${reason}\` by \`${message.author.tag}\` for ${args[0]} days`);
			});
		}else{
			member.ban({ reason: reason }).then(m => {
				message.guild.owner.send(`\`${m.displayName}\` has been banned from \`${message.guild.name}\` for \`${reason}\` by \`${message.author.tag}\``);
				return message.channel.send(`\`${m.displayName}\` has been banned because of \`${reason}\` by \`${message.author.tag}\``);
			});
		}
	},
};
