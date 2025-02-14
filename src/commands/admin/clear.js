const { Command } = require('sheweny');

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      description: 'Supprimer un nombre spécifique de messages',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'nombre',
          description: 'Le nombre de messages à supprimer',
          type: 4, // INTEGER type
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const count = interaction.options.getInteger('nombre');

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission de supprimer des messages.', ephemeral: true });
    }

    if (count < 1 || count > 100) {
      return interaction.reply({ content: 'Veuillez fournir un nombre de messages à supprimer entre 1 et 100.', ephemeral: true });
    }

    try {
      const messages = await interaction.channel.bulkDelete(count, true);
      return interaction.reply({ content: `${messages.size} messages ont été supprimés avec succès.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors de la suppression des messages.', ephemeral: true });
    }
  }
};