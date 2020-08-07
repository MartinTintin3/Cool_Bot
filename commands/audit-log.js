module.exports = {
	name: 'audit-log',
	aliases: ['audit-logs', 'audit'],
	description: 'Fetch the audit logs for the specified server/guild',
	category: 'Info',
	usage: '<server/guild id> <number of entries>',
	private: true,
	args: true,
	args_num: 2,
	execute(message, args){
		message.client.guilds.cache.get(args[0]).fetchAuditLogs()
			.then(audit => {
				const logs = audit.entries.first(parseInt(args[1]));
				let data = [];
				for(const i in logs){
					data.push(`Action: ${logs[i].action}\nTimestamp: ${logs[i].createdAt}\nExecuter: ${logs[i].executor.tag}\nTarget: ${logs[i].target}\nExtra: ${logs[i].extra}\n`);
					for(const n in logs[i].changes){
						data[data.length - 1] += `Changes: {\n\tKey: ${logs[i].changes[n].key}\nOld: ${JSON.stringify(logs[i].changes[n].old)}\nNew: ${JSON.stringify(logs[i].changes[n].new)}}`;
					}
					data[data.length - 1] += '\n';
				}
				return message.channel.send(data.reverse().join('\n'));
			})
			.catch(console.error);
	},
};
