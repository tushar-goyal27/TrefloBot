const fs = require('node:fs');
const path = require('node:path');

const { Client, Events, GatewayIntentBits, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { token, DB_CONNECTION } = require('./config.json');

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const DCUser = require("./models/User");

// Connect to the Database
mongoose.connect(DB_CONNECTION, () => {
	console.log("Connected to DB");
})

// Create Discord Client
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

// Create Express App
const app = express();
app.use(bodyParser.json());

// When the client is ready
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Load Commands to client
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Send route
app.post('/send', async (req, res) => {
	const channel = client.channels.cache.find(channel => channel.name === req.body.channel)

	const btn = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel(req.body.btn_text)
					.setStyle(ButtonStyle.Primary),
			);
	await channel.send({content: req.body.text, files: [req.body.imageURL], components: [btn]})
	res.status(200).json({
		message: "Sent"
	});
})

// Get all users
app.get('/getdata', (req, res) => {
	DCUser.find({}, (err, users) => {
		var allusers = [];

		users.forEach((user) => {
		allusers.push(user);
		});

    	res.send(allusers);
	})
})

app.listen(5000, () => console.log("Server Started"));

client.login(token);
module.exports = app;