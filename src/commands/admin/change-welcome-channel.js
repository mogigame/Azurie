const { Command } = require('sheweny');
const fs = require('fs');
const path = require('path');

module.exports = class ChangeWelcomeChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'change-welcome-channel',
      description: 'Changer le salon de bienvenue du serveur',
      type: 'SLASH_COMMAND',
      category: 'Administration',
      options: [
        {
          name: 'channel',
          description: 'Le nouveau salon de bienvenue',
          type: 7,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const newChannel = interaction.options.getChannel('channel');
    const configPath = path.resolve(__dirname, '../../config.json');


    // Mettre à jour le salon de bienvenue en mémoire
    this.client.config.welcomeChannelId = newChannel.id;

    // Persister le changement dans le fichier config.json
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.welcomeChannelId = newChannel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

    await interaction.reply({ content: `Le salon de bienvenue a été changé en ${newChannel.name}.`, ephemeral: true });
  }
};