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
	const { everyone_spam } = require('./customizations.json');
	setInterval(() => {
		for(const i in everyone_spam){
			client.guilds.cache.get(everyone_spam[i].guild).channels.cache.get(everyone_spam[i].channel).send('@everyone');
		}
	}, 500);
});

// Import messageChecker and messageLogger functions
const { checkMessage } = require('./messageChecker.js');
const { logMessage } = require('./messageLogger.js');


client.on('guildCreate', guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildDelete', guild => {
	// this event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', (member) => {
	if(member.guild.id != '730054736530636841') return;
	member.send(`Thanks for joining ${member.guild.name}! If you get banned and you want to appeal, then message \`${prefix}appeal why we should unban you\` to me`);
});

// On message
client.on('message', message => {
	try {
		// Make an array of arguments and make a constant for the command name
		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		// Log and check message
		logMessage(message);
		checkMessage(message, args);

		// Return if message doesn't start with prefix or the author is a bot
		if (!message.content.startsWith(prefix) || message.author.bot) return;

		// Make a constant for the command object
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// If can't find command then return
		if (!command) return;

		// If the command is private, return
		if(command.private && (message.channel.type != 'dm' || message.author.id != owner_info.id)) return;

		// If command is guildOnly then return message "I can't execute that command inside DMs!"
		if (command.guildOnly && message.channel.type !== 'text') {
			return message.reply('I can\'t execute that command inside DMs!');
		}

		// If command requires arguments and it has a specific argument amount and the user didn't specify correct number of arguments
		if ((command.args && command.args_num && args.length != command.args_num) || command.args && !args.length) {
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

			command.execute(message, args);
		}catch (error) {
			console.error(error);
			message.reply(`there was an error trying to execute that command!\nMaybe try \`${prefix}help ${command.name}\` to check if you did everything correctly!`);
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
