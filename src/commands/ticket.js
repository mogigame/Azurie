const { Command } = require('sheweny');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');
const config = require('../config');
const fs = require('fs');

module.exports = class TicketCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ticket',
      description: 'Créer un ticket',
      type: 'SLASH_COMMAND',
    });
  }

  async execute(interaction) {
    const category = interaction.guild.channels.cache.get(config.openTicketCategoryId);
    if (!category) {
      return interaction.reply({ content: 'Catégorie de ticket non trouvée.', ephemeral: true });
    }

    const existingChannel = interaction.guild.channels.cache.find(c => c.name.startsWith(`ticket-`) && c.topic === interaction.user.id.toString());
    if (existingChannel) {
      return interaction.reply({ content: `Vous avez déjà un ticket ouvert: <#${existingChannel.id}>`, ephemeral: true });
    }

    // Read and increment the ticket number
    const ticketData = JSON.parse(fs.readFileSync('./src/ticket-number.json', 'utf8'));
    ticketData.ticket += 1;
    fs.writeFileSync('./src/ticket-number.json', JSON.stringify(ticketData, null, 2));

    const channel = await interaction.guild.channels.create({
      name: `ticket-${ticketData.ticket}`,
      type: ChannelType.GuildText,
      parent: category.id,
      topic: interaction.user.id.toString(),
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
        },
        {
          id: interaction.client.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels],
        },
      ],
    });

    const embed = new EmbedBuilder()
      .setTitle('Ticket ouvert')
      .setDescription('Merci de décrire votre problème. Un membre du staff sera bientôt avec vous.')
      .setColor('#00FF00')
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('close')
          .setLabel('Fermer')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('claim')
          .setLabel('Claim')
          .setStyle(ButtonStyle.Primary)
      );

    await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });

    return interaction.reply({ content: `Ticket créé: <#${channel.id}>`, ephemeral: true });
  }
};