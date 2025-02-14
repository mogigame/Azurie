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

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission d\'avertir des membres.', ephemeral: true });
    }

    try {
      await Warn.create({
        userId: user.id,
        moderatorId: interaction.user.id,
        reason: reason,
      });
      return interaction.reply({ content: `${user.tag} a été averti avec succès. Raison: ${reason}` });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors de l\'enregistrement de l\'avertissement.', ephemeral: true });
    }
  }
};