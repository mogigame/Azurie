const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const { format } = require('date-fns');
const { fr } = require('date-fns/locale');
const Ban = require('../../models/Ban');
const Mute = require('../../models/Mute');
const Report = require('../../models/Report');
const Warn = require('../../models/Warn');

module.exports = class SanctionListCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sanction-list',
      description: 'Répertorie toutes les sanctions du serveur et à qui elles appartiennent',
      type: 'SLASH_COMMAND',
    });
  }

  async execute(interaction) {
    const bans = await Ban.findAll();
    const mutes = await Mute.findAll();
    const reports = await Report.findAll();
    const warns = await Warn.findAll();

    const embed = new EmbedBuilder()
      .setTitle('Liste des sanctions du serveur')
      .setColor('#0000FF') // Utilisation de la valeur hexadécimale pour la couleur bleue
      .setTimestamp();

    if (bans.length > 0) {
      embed.addFields(
        { name: `Bans (${bans.length})`, value: bans.map(ban => {
          const formattedTimestamp = format(new Date(ban.timestamp), "EEEE dd MMMM yyyy 'à' HH:mm:ss", { locale: fr });
          const status = ban.active ? 'Actif' : 'Inactif';
          return `- **Utilisateur:** <@${ban.userId}> ==> **Raison:** ${ban.reason} ==> ${formattedTimestamp} ==> **Statut:** ${status}`;
        }).join('\n'), inline: false }
      );
      embed.addFields({ name: '\u200B', value: '\u200B' }); // Ajoute un espace entre les sections
    }

    if (mutes.length > 0) {
      embed.addFields(
        { name: `Mutes (${mutes.length})`, value: mutes.map(mute => {
          const formattedTimestamp = format(new Date(mute.timestamp), "EEEE dd MMMM yyyy 'à' HH:mm:ss", { locale: fr });
          return `- **Utilisateur:** <@${mute.userId}> ==> **Raison:** ${mute.reason}, **Durée:** ${mute.duration} minutes ==> ${formattedTimestamp}`;
        }).join('\n'), inline: false }
      );
      embed.addFields({ name: '\u200B', value: '\u200B' }); // Ajoute un espace entre les sections
    }

    if (reports.length > 0) {
      embed.addFields(
        { name: `Reports (${reports.length})`, value: reports.map(report => {
          const formattedTimestamp = format(new Date(report.timestamp), "EEEE dd MMMM yyyy 'à' HH:mm:ss", { locale: fr });
          return `- **Utilisateur:** <@${report.userId}> ==> **Raison:** ${report.reason} ==> ${formattedTimestamp}`;
        }).join('\n'), inline: false }
      );
      embed.addFields({ name: '\u200B', value: '\u200B' }); // Ajoute un espace entre les sections
    }

    if (warns.length > 0) {
      embed.addFields(
        { name: `Warnings (${warns.length})`, value: warns.map(warn => {
          const formattedTimestamp = format(new Date(warn.timestamp), "EEEE dd MMMM yyyy 'à' HH:mm:ss", { locale: fr });
          return `- **Utilisateur:** <@${warn.userId}> ==> **Raison:** ${warn.reason} ==> ${formattedTimestamp}`;
        }).join('\n'), inline: false }
      );
    }

    if (bans.length === 0 && mutes.length === 0 && reports.length === 0 && warns.length === 0) {
      embed.setDescription('Aucune sanction trouvée.');
    }

    return interaction.reply({ embeds: [embed] });
  }
};