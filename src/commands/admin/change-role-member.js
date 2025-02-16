const { Command } = require('sheweny');
const fs = require('fs');
const path = require('path');

module.exports = class ChangeRoleMemberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'change-role-member',
      description: 'Change l\'ID du rôle attribué aux nouveaux membres',
      type: 'SLASH_COMMAND',
      category: 'Utilitaire',
      options: [
        {
          name: 'role',
          description: 'Le nouveau rôle à attribuer',
          type: 8,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const newRole = interaction.options.getRole('role');
    const configPath = path.resolve(__dirname, '../../config.json');

    // Mettre à jour le rôle en mémoire
    this.client.config.roleMembreId = newRole.id;

    // Persister le changement dans le fichier config.json
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.roleMembreId = newRole.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

    await interaction.reply({ content: `L'ID du rôle à attribuer a été changé en ${newRole.name}.`, ephemeral: true });
  }
};