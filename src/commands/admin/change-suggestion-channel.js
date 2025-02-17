const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../../config.json');
let config = require(configPath);

module.exports = class SetSuggestionChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'change-suggestion-channel',
      description: 'Définir le salon de suggestions',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'channel',
          description: 'Le salon où les suggestions seront envoyées',
          type: 7, // CHANNEL type
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    // Mettre à jour le fichier de configuration
    config.suggestionChannelId = channel.id;
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};`);

    const embed = new EmbedBuilder()
      .setTitle('Salon de suggestions mis à jour')
      .setColor('#00FF00') // Utilisation de la valeur hexadécimale pour la couleur verte
      .setDescription(`Le salon de suggestions a été défini sur <#${channel.id}>.`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: 64 }); // Utiliser les flags pour les réponses éphémères
  }
};