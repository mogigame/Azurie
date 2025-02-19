const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js')
const fs = require('fs');
const path = require('path');

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
    const newChannel = interaction.options.getChannel('channel');
    const configPath = path.resolve(__dirname, '../../config.json');


    // Mettre à jour le salon de bienvenue en mémoire
    this.client.config.suggestionChannelId = newChannel.id;

    // Persister le changement dans le fichier config.json
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.suggestionChannelId = newChannel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

    const embed = new EmbedBuilder()
    .setTitle('Salon de suggestions mis à jour')
    .setColor('#00FF00') // Utilisation de la valeur hexadécimale pour la couleur verte
    .setDescription(`Le salon de suggestions a été défini sur <#${newChannel.id}>.`)
    .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
