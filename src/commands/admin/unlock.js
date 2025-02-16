const { Command } = require('sheweny');
const { PermissionsBitField } = require('discord.js');

module.exports = class UnlockCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unlock',
      description: 'Déverrouiller un canal',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'canal',
          description: 'Le canal à déverrouiller',
          type: 7, // CHANNEL type
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');
    const logChannel = interaction.guild.channels.cache.get(this.client.config.logChannelId);

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission de déverrouiller des canaux.', ephemeral: true });
    }

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: null,
      });
      logChannel.send(`${interaction.user.tag} a déverrouillé ${channel.name}.`);
      return interaction.reply({ content: `${channel.name} a été déverrouillé avec succès.` });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors du déverrouillage du canal.', ephemeral: true });
    }
  }
};