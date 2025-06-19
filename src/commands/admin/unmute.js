const { Command } = require('sheweny');
const { PermissionsBitField } = require('discord.js');

module.exports = class UnmuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unmute',
      description: 'Enlever le statut muet d\'un utilisateur',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur à démuter',
          type: 6,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const member = interaction.options.getMember('utilisateur');
    let logChannel;
    if (this.client.config && this.client.config.logChannelId) {
      logChannel = interaction.guild.channels.cache.get(this.client.config.logChannelId);
    }

    if (!member) {
      return interaction.reply({ content: 'Utilisateur non trouvé.', flags: 64 });
    }

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission de démuter des membres.', flags: 64 });
    }

    if (!member.manageable) {
      return interaction.reply({ content: 'Je ne peux pas démuter cet utilisateur.', flags: 64 });
    }

    try {
      await member.timeout(null);
      if (logChannel) {
        logChannel.send(`${interaction.user.tag} a démuté ${member.user.tag}.`);
      }
      return interaction.reply({ content: `${member.user.tag} a été démuté avec succès.` });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors du démutage de cet utilisateur.', flags: 64 });
    }
  }
};