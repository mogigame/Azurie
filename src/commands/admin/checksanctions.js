const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const { format } = require('date-fns');
const { fr } = require('date-fns/locale');
const Ban = require('../../models/Ban');
const Mute = require('../../models/Mute');
const Report = require('../../models/Report');
const Warn = require('../../models/Warn');

module.exports = class CheckSanctionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'checksanctions',
      description: 'Vérifier les sanctions d\'un utilisateur',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur dont vous souhaitez voir les sanctions',
          type: 6, // USER type
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const userId = user.id;

    const bans = await Ban.findAll({ where: { userId } });
    const mutes = await Mute.findAll({ where: { userId } });
    const reports = await Report.findAll({ where: { userId } });
    const warns = await Warn.findAll({ where: { userId } });

    const embed = new EmbedBuilder()
      .setTitle(`Sanctions pour ${user.tag}`)
      .setColor('#0000FF') // Utilisation de la valeur hexadécimale pour la couleur bleue
      .setTimestamp();

    if (bans.length > 0) {
      embed.addFields(
        { name: `Bans (${bans.length})`, value: bans.map(ban => {
          const formattedTimestamp = format(new Date(ban.timestamp), "EEEE dd MMMM yyyy 'à' HH:mm:ss", { locale: fr });
          const status = ban.active ? 'Actif' : 'Inactif';
          return `- **Raison:** ${ban.reason} ==> ${formattedTimestamp} ==> **Statut:** ${status}`;
        }).join('\n'), inline: false }
      );
      embed.addFields({ name: '\u200B', value: '\u200B' }); // Ajoute un espace entre les sections
    }

    if (mutes.length > 0) {
      embed.addFields(
        { name: `Mutes (${mutes.length})`, value: mutes.map(mute => {
          const formattedTimestamp = format(new Date(mute.timestamp), "EEEE dd MMMM yyyy 'à' HH:mm:ss", { locale: fr });
          return `- **Raison:** ${mute.reason}, **Durée:** ${mute.duration} minutes ==> ${formattedTimestamp}`;
        }).join('\n'), inline: false }
      );
      embed.addFields({ name: '\u200B', value: '\u200B' }); // Ajoute un espace entre les sections
    }

    if (reports.length > 0) {
      embed.addFields(
        { name: `Reports (${reports.length})`, value: reports.map(report => {
          const formattedTimestamp = format(new Date(report.timestamp), "EEEE dd MMMM yyyy 'à' HH:mm:ss", { locale: fr });
          return `- **Raison:** ${report.reason} ==> ${formattedTimestamp}`;
        }).join('\n'), inline: false }
      );
      embed.addFields({ name: '\u200B', value: '\u200B' }); // Ajoute un espace entre les sections
    }

    if (warns.length > 0) {
      embed.addFields(
        { name: `Warnings (${warns.length})`, value: warns.map(warn => {
          const formattedTimestamp = format(new Date(warn.timestamp), "EEEE dd MMMM yyyy 'à' HH:mm:ss", { locale: fr });
          return `- **Raison:** ${warn.reason} ==> ${formattedTimestamp}`;
        }).join('\n'), inline: false }
      );
    }

    if (bans.length === 0 && mutes.length === 0 && reports.length === 0 && warns.length === 0) {
      embed.setDescription('Aucune sanction trouvée.');
    }

    return interaction.reply({ embeds: [embed] });
  }
};