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
				let data = '';
				for(const i in logs){
					data += `Action: ${logs[i].action}\nExecuter: ${logs[i].executor.tag}\nTarget: ${logs[i].target}\nChanges: {
            ${logs[i].changes.key}
          }\n\n`;
				}
				return message.channel.send(data);
			})
			.catch(console.error);
	},
};
