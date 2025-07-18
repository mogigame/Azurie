const { Command } = require('sheweny');
const { PermissionsBitField } = require('discord.js');

module.exports = class LockCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lock',
      description: 'Verrouiller un canal',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'canal',
          description: 'Le canal à verrouiller',
          type: 7, // CHANNEL type
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');
    let logChannel;
    if (this.client.config && this.client.config.logChannelId) {
      logChannel = interaction.guild.channels.cache.get(this.client.config.logChannelId);
    }

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission de verrouiller des canaux.', flags: 64 });
    }

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false,
      });
      if (logChannel) {
        logChannel.send(`${interaction.user.tag} a verrouillé ${channel.name}.`);
      }
      return interaction.reply({ content: `${channel.name} a été verrouillé avec succès.` });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors du verrouillage du canal.', flags: 64 });
    }
  }
};