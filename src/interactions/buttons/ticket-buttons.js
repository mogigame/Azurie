const { Button } = require('sheweny');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = class TicketButtonHandler extends Button {
    constructor(client) {
        super(client, ['close', 'claim', 'delete', 'archive', 'reopen']);
    }

    async execute(button) {
        const { customId, channel, member, client } = button;

        if (customId === 'close') {
            if (channel.parentId !== config.openTicketCategoryId) {
                return button.reply({ content: 'Ce ticket ne peut pas être fermé.', ephemeral: true });
            }

            await button.reply({ content: 'Fermeture du ticket en cours...', ephemeral: true });

            // Vérifier si la catégorie de destination existe
            const closeCategory = await client.channels.fetch(config.closedTicketCategoryId)
                .catch(err => {
                    console.error(`❌ Erreur lors de la récupération de la catégorie fermée: ${err}`);
                    return null;
                });

            if (!closeCategory || closeCategory.type !== 4) {
                console.error(`❌ L'ID fourni ne correspond pas à une catégorie valide : ${config.closedTicketCategoryId}`);
                return button.followUp({ content: 'Erreur : la catégorie des tickets fermés est introuvable ou invalide.', ephemeral: true });
            }

            // Déplacer le ticket après une courte attente pour éviter les problèmes de timing avec Discord
                try {
                    await channel.setParent(closeCategory.id, { lockPermissions: false });
                    console.log(`✅ Ticket ${channel.name} déplacé vers la catégorie fermée.`);
                } catch (err) {
                    console.error(`❌ Erreur lors du déplacement du ticket ${channel.name} : ${err}`);
                    await button.followUp({ content: 'Erreur lors du déplacement du ticket.', ephemeral: true });
                }

            const embed = new EmbedBuilder()
                .setTitle('Ticket fermé')
                .setDescription('Vous pouvez maintenant archiver, supprimer ou réouvrir ce ticket.')
                .setColor('#FFA500')
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('delete').setLabel('Supprimer').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('archive').setLabel('Archiver').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('reopen').setLabel('Réouvrir').setStyle(ButtonStyle.Success),
            );

            await channel.send({ embeds: [embed], components: [row] });
        }


        if (customId === 'claim') {
            await button.reply({ content: `Le ticket a été pris en charge par ${member}.`, ephemeral: false });
        }

        if (customId === 'delete') {
            await button.reply({ content: 'Suppression du ticket en cours...', ephemeral: true });
            await channel.delete();
        }

        if (customId === 'archive') {
            await button.reply({ content: 'Archivage du ticket en cours...', ephemeral: true });

            // Récupération de l'historique des messages
            let messages = await channel.messages.fetch({ limit: 100 });
            messages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp); // Trier par ancienneté

            let logContent = `Historique du ticket ${channel.name}\n\n`;
            messages.forEach(msg => {
                const time = new Date(msg.createdTimestamp).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
                logContent += `[${time}] ${msg.author.tag}: ${msg.content}\n`;
            });

            // Création du fichier log
            const logsDir = path.join(__dirname, '../../logs/ticket');
            if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

            const logFilePath = path.join(logsDir, `${channel.name}.log`);
            fs.writeFileSync(logFilePath, logContent, 'utf-8');

            // Vérification du salon de logs
            const logChannel = client.channels.cache.get(config.archiveTicketChannelId);
            if (logChannel) {
                await logChannel.send({ content: `📁 Historique du ticket **${channel.name}** :`, files: [logFilePath] });
            } else {
                console.error("⚠ Le salon de logs est introuvable !");
            }

            // Déplacer le ticket vers la catégorie des archivés
            await channel.setParent(config.archiveTicketCategoryId, { lockPermissions: false })
                .catch(console.error);

            await button.followUp({ content: 'Le ticket a été archivé et l\'historique a été envoyé.', ephemeral: true });
        }

        if (customId === 'reopen') {
            await button.reply({ content: 'Réouverture du ticket en cours...', ephemeral: true });
            await channel.setParent(config.openTicketCategoryId, { lockPermissions: false }) // Correction ici
                .catch(console.error);

            const embed = new EmbedBuilder()
                .setTitle('Ticket réouvert')
                .setDescription('Le ticket est de nouveau actif.')
                .setColor('#00FF00')
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('close').setLabel('Fermer').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('claim').setLabel('Claim').setStyle(ButtonStyle.Primary),
            );

            await channel.send({ embeds: [embed], components: [row] });
        }
    }
};
