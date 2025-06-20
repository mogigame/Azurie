const { Command } = require('sheweny');
const Warn = require('../../models/Warn');

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      description: 'Avertir un utilisateur',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur à avertir',
          type: 6,
          required: true,
        },
        {
          name: 'raison',
          description: 'La raison de l\'avertissement',
          type: 3,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const reason = interaction.options.getString('raison');
    let logChannel;
    if (this.client.config && this.client.config.logChannelId) {
      logChannel = interaction.guild.channels.cache.get(this.client.config.logChannelId);
    }

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission d\'avertir des membres.', flags: 64 });
    }

    try {
      await Warn.create({
        userId: user.id,
        moderatorId: interaction.user.id,
        reason: reason,
      });
      if (logChannel) {
        logChannel.send(`${interaction.user.tag} a averti ${user.tag}.`);
      }
      return interaction.reply({ content: `${user.tag} a été averti avec succès. Raison: ${reason}` });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors de l\'enregistrement de l\'avertissement.', flags: 64 });
    }
  }
};