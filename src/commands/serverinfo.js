const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      description: 'Affiche les informations du serveur',
      type: 'SLASH_COMMAND',
      category: 'membre'
    });
  }

  async execute(interaction) {
    const guild = interaction.guild;

    const embed = new EmbedBuilder()
      .setTitle(`Informations sur le serveur: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Nom du serveur', value: guild.name, inline: true },
        { name: 'ID du serveur', value: guild.id, inline: true },
        { name: 'Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Membres', value: `${guild.memberCount}`, inline: true },
        { name: 'Rôles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Salons', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Créé le', value: `${guild.createdAt.toDateString()}`, inline: true }
      )
      .setColor('#0000FF'); // Utilisation de la valeur hexadécimale pour la couleur bleue

    return interaction.reply({ embeds: [embed] });
  }
};