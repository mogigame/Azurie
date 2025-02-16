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
    await interaction.deferReply({ ephemeral: true }); // Différer la réponse pour donner plus de temps

    const member = interaction.options.getMember('utilisateur');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';

    if (!member) {
      return interaction.editReply({ content: 'Utilisateur non trouvé.' });
    }

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.editReply({ content: 'Vous n\'avez pas la permission d\'expulser des membres.' });
    }

    if (!member.kickable) {
      return interaction.editReply({ content: 'Je ne peux pas expulser cet utilisateur.' });
    }

    try {
      await member.kick(reason);
      return interaction.editReply({ content: `${member.user.tag} a été expulsé avec succès. Raison: ${reason}` });
    } catch (error) {
      console.error(error);
      return interaction.editReply({ content: 'Une erreur est survenue lors de l\'expulsion de cet utilisateur.' });
    }
  }
};