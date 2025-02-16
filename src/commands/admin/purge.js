const { Command } = require('sheweny');
const { PermissionsBitField } = require('discord.js');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      description: 'Supprimer tous les messages d\'un utilisateur spécifique dans le canal actuel',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur dont les messages doivent être supprimés',
          type: 6, 
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const logChannel = interaction.guild.channels.cache.get(this.client.config.logChannelId);

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission de gérer les messages.', ephemeral: true });
    }

    const messages = await interaction.channel.messages.fetch();
    const userMessages = messages.filter(msg => msg.author.id === user.id);

    try {
      await interaction.channel.bulkDelete(userMessages, true);
      logChannel.send(`${user.tag} a supprimé tous les messages de ${user.tag} dans ${interaction.channel.name}.`);
      return interaction.reply({ content: `Tous les messages de ${user.tag} ont été supprimés avec succès.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors de la suppression des messages de cet utilisateur.', ephemeral: true });
    }
  }
};