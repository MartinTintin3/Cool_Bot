module.exports = {
	name: 'me',
	aliases: ['my-info'],
	description: 'Will return your username(`message.author.username`), ID(`message.author.id`), and discriminator(`message.author.discriminator`)',
	category: 'Info',
	execute(message, args) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}\nYour Discriminator: #${message.author.discriminator}`);
	},
};
