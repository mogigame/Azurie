const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const { format } = require('date-fns');
const { fr } = require('date-fns/locale');
const Ban = require('../../models/Ban');

module.exports = class BanListCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban-list',
      description: 'Répertorie tous les bans du serveur',
      type: 'SLASH_COMMAND',
    });
  }

  async execute(interaction) {
    const bans = await Ban.findAll({ where: { active: true } });

    const embed = new EmbedBuilder()
      .setTitle('Liste des bannissements du serveur')
      .setColor('#FF0000') // Utilisation de la valeur hexadécimale pour la couleur rouge
      .setTimestamp();

    if (bans.length > 0) {
      embed.addFields(
        { name: `Bans (${bans.length})`, value: bans.map(ban => {
          const formattedTimestamp = format(new Date(ban.timestamp), "EEEE dd MMMM yyyy 'à' HH:mm:ss", { locale: fr });
          return `- **Utilisateur:** <@${ban.userId}> ==> **Raison:** ${ban.reason} ==> ${formattedTimestamp}`;
        }).join('\n'), inline: false }
      );
    } else {
      embed.setDescription('Aucun bannissement trouvé.');
    }

    return interaction.reply({ embeds: [embed] });
  }
};