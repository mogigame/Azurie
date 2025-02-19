const { Command } = require('sheweny');
const fs = require('fs');
const path = require('path');

module.exports = class ChangeRoleMemberCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'change-ticket-categories',
            description: 'Change l\'ID du rôle attribué aux nouveaux membres',
            type: 'SLASH_COMMAND',
            category: 'Utilitaire',
            options: [
                {
                    name: 'open-catégorie',
                    description: 'La nouvelle catégorie pour les tickets ouverts',
                    type: 7,
                    required: true,
                },
                {
                    name: 'close-catégorie',
                    description: 'La nouvelle catégorie pour les tickets fermés',
                    type: 7,
                    required: true,
                },
                {
                    name: 'archive-catégorie',
                    description: 'La nouvelle catégorie pour les tickets archivés',
                    type: 7,
                    required: true,
                },
                {
                    name: 'archive-channel',
                    description: 'Le channel où les tickets archivés seront sauvegardés',
                    type: 7,
                    required: true,
                }
            ],
        });
    }

    async execute(interaction) {
        const openCategory = interaction.options.getChannel('open-catégorie');
        const closeCategory = interaction.options.getChannel('close-catégorie');
        const archiveCategory = interaction.options.getChannel('archive-catégorie');
        const archiveChannel = interaction.options.getChannel('archive-channel');
        const configPath = path.resolve(__dirname, '../../config.json');
        const logChannel = interaction.guild.channels.cache.get(this.client.config.logChannelId);

        // Mettre à jour le rôle en mémoire
        this.client.config.openTicketCategoryId = openCategory.id;
        this.client.config.closedTicketCategoryId = closeCategory.id;
        this.client.config.archiveTicketCategoryId = archiveCategory.id;
        this.client.config.archiveTicketChannelId = archiveChannel.id;

        // Persister le changement dans le fichier config.json
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        config.openTicketCategoryId = openCategory.id;
        config.closedTicketCategoryId = closeCategory.id;
        config.archiveTicketCategoryId = archiveCategory.id;
        config.archiveTicketChannelId = archiveChannel.id;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

        await interaction.reply({ content: `Les catégorie des tickets ont été changer`, ephemeral: true });
        logChannel.send(`Les catégories des tickets ont été changées. Catégorie ouverte : ${openCategory.name}\n Catégorie fermée : ${closeCategory.name}\n Catégorie archivée : ${archiveCategory.name}\n Channel archivé : ${archiveChannel.name}`);
    }
};