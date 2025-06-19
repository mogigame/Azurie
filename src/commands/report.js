const { Command } = require('sheweny');
const Report = require('../models/Report');

module.exports = class ReportCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'report',
      description: 'Signaler un utilisateur',
      type: 'SLASH_COMMAND',
      category: 'membre',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur à signaler',
          type: 6, // USER type
          required: true,
        },
        {
          name: 'raison',
          description: 'La raison du signalement',
          type: 3, // STRING type
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

    try {
      await Report.create({
        userId: user.id,
        reporterId: interaction.user.id,
        reason: reason,
      });
      if (logChannel) {
        logChannel.send(`${interaction.user.tag} a signalé ${user.tag}.`);
      }
      return interaction.reply({ content: `L'utilisateur ${user.tag} a été signalé avec succès. Raison: ${reason}`, flags: 64 });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors de l\'enregistrement du signalement.', flags: 64 });
    }
  }
};