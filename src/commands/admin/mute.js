const { Command } = require('sheweny');
const { PermissionsBitField } = require('discord.js');
const Mute = require('../../models/Mute');

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      description: 'Rendre muet un utilisateur',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur à rendre muet',
          type: 6,
          required: true,
        },
        {
          name: 'durée',
          description: 'La durée du mute (en minutes)',
          type: 4,
          required: true,
        },
        {
          name: 'raison',
          description: 'La raison du mute',
          type: 3,
          required: false,
        },
      ],
    });
  }

  async execute(interaction) {
    const member = interaction.options.getMember('utilisateur');
    const duration = interaction.options.getInteger('durée');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';

    if (!member) {
      return interaction.reply({ content: 'Utilisateur non trouvé.', ephemeral: true });
    }

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission de rendre muet des membres.', ephemeral: true });
    }

    if (!member.manageable) {
      return interaction.reply({ content: 'Je ne peux pas rendre muet cet utilisateur.', ephemeral: true });
    }

    try {
      await member.timeout(duration * 60 * 1000, reason);
      await Mute.create({
        userId: member.id,
        moderatorId: interaction.user.id,
        reason: reason,
        duration: duration,
      });
      return interaction.reply({ content: `${member.user.tag} a été rendu muet pour ${duration} minutes. Raison: ${reason}` });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors du mute de cet utilisateur.', ephemeral: true });
    }
  }
};