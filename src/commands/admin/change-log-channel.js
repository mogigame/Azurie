const { Command } = require('sheweny');
const fs = require('fs');
const path = require('path');

module.exports = class ChangeLogChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'change-log-channel',
      description: 'Changer le salon de logs du serveur',
      type: 'SLASH_COMMAND',
      category: 'admin',
      options: [
        {
          name: 'channel',
          description: 'Le nouveau salon de logs',
          type: 7, 
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const newChannel = interaction.options.getChannel('channel');
    const configPath = path.resolve(__dirname, '../../config.json');

    this.client.config.logChannelId = newChannel.id;

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.logChannelId = newChannel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

    await interaction.reply({ content: `Le salon de logs a été changé en ${newChannel.name}.`, ephemeral: true });
  }
};