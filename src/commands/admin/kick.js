const { Command } = require('sheweny');
const { PermissionsBitField } = require('discord.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      description: 'Expulser un utilisateur du serveur',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur à expulser',
          type: 6,
          required: true,
        },
        {
          name: 'raison',
          description: 'La raison de l\'expulsion',
          type: 3,
          required: false,
        },
      ],
    });
  }

  async execute(interaction) {
    const member = interaction.options.getMember('utilisateur');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';

    if (!member) {
      return interaction.reply({ content: 'Utilisateur non trouvé.', ephemeral: true });
    }

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission d\'expulser des membres.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: 'Je ne peux pas expulser cet utilisateur.', ephemeral: true });
    }

    try {
      await member.kick(reason);
      return interaction.reply({ content: `${member.user.tag} a été expulsé avec succès. Raison: ${reason}` });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors de l\'expulsion de cet utilisateur.', ephemeral: true });
    }
  }
};