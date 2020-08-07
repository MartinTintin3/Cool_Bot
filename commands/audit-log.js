module.exports = {
	name: 'audit-log',
	aliases: ['audit-logs', 'audit'],
	description: 'Fetch the audit logs for the specified server/guild',
	category: 'Info',
	usage: '<server/guild id> <number of entries> <"force" is optional and if provided will make multiple messages if one message is longer than 2000 characters>',
	private: true,
	args: true,
	execute(message, args){
		message.client.guilds.cache.get(args[0]).fetchAuditLogs()
			.then(audit => {
				const logs = audit.entries.first(parseInt(args[1]));
				let data = [];
				for(const i in logs){
					data.push(`Action: ${logs[i].action}\nTimestamp: ${logs[i].createdAt}\nExecuter: ${logs[i].executor.tag}\nTarget: ${logs[i].target}\nExtra: ${logs[i].extra}\n`);
					for(const n in logs[i].changes){
						data[data.length - 1] += `Changes: {\n\tKey: ${logs[i].changes[n].key}\n\tOld: ${JSON.stringify(logs[i].changes[n].old)}\n\tNew: ${JSON.stringify(logs[i].changes[n].new)}}`;
					}
					data[data.length - 1] += '\n';
				}

				const newData = data.reverse().join('\n');
				if(newData > 2000 && args[2] != 'force'){
					return message.channel.send('This message is to long. Please specify a smaller amount of entries');
				}else if(args[2] == 'force'){
					return message.channel.send(data.join('\n'), { split: true });
				}
				return message.channel.send(newData);
			})
			.catch(console.error);
	},
};
