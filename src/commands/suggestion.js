const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const Suggestion = require('../models/Suggestion');
const config = require('../config');

module.exports = class SuggestionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'suggestion',
      description: 'Envoyer une suggestion au staff',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'message',
          description: 'Le contenu de votre suggestion',
          type: 3, // STRING type
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const user = interaction.user;
    const userId = user.id;
    const suggestionText = interaction.options.getString('message');

    await Suggestion.create({
      userId,
      suggestion: suggestionText,
      timestamp: new Date(),
    });

    const embed = new EmbedBuilder()
      .setTitle('Suggestion envoyée')
      .setColor('#00FF00') // Utilisation de la valeur hexadécimale pour la couleur verte
      .setDescription('Votre suggestion a été envoyée au staff avec succès.')
      .setTimestamp();

    // Utiliser l'ID du salon de suggestions depuis le fichier de configuration
    const staffChannel = interaction.guild.channels.cache.get(config.suggestionChannelId);
    if (staffChannel) {
      const staffEmbed = new EmbedBuilder()
        .setTitle('Nouvelle suggestion')
        .setColor('#0000FF') // Utilisation de la valeur hexadécimale pour la couleur bleue
        .setDescription(`**Suggestion de <@${userId}> :**\n${suggestionText}`)
        .setTimestamp();
      staffChannel.send({ embeds: [staffEmbed] });
    }

    return interaction.reply({ embeds: [embed], flags: 64 }); // Utiliser les flags pour les réponses éphémères
  }
};