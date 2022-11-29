const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

const DCUser = require("../models/User");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send_message')
		.setDescription('Send Post to any channel.')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to send post to')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('text')
				.setDescription('Text to send')
				.setRequired(true))
				
		.addStringOption(option => 
			option.setName('url')
				.setDescription('url')
				.setRequired(true))
				
		.addStringOption(option => 
			option.setName('button_text')
				.setDescription('Button Text to send')
				.setRequired(true)),
		
	async execute(interaction) {
		try {
			const channelName = interaction.options.getChannel('channel');
			const text = interaction.options.getString('text');
			const imageURL = interaction.options.getString('url');
			const btn_text = interaction.options.getString('button_text');

			const btn = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('primary')
						.setLabel(btn_text)
						.setStyle(ButtonStyle.Primary),
				);
			
			const user = new DCUser({
				username: interaction.user.username,
				servername: interaction.guild.name
			})

			await user.save()
			.then(data => {
				console.log(data);
			})
			.catch(err => {
				console.log(err);
			});

			await interaction.reply('Post Sent');
			await channelName.send({content: text, files: [imageURL], components: [btn]});
		} catch (error) {
			await interaction.reply('Error');
		}
		

	}
};