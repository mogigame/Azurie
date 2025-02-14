const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const Ban = require('../../models/Ban');
const Mute = require('../../models/Mute');
const Report = require('../../models/Report');
const Warn = require('../../models/Warn');

module.exports = class SanctionClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sanction-clear',
      description: 'Supprimer toutes les sanctions d\'un utilisateur',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur dont vous souhaitez supprimer les sanctions',
          type: 6, // USER type
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const userId = user.id;

    const bans = await Ban.destroy({ where: { userId } });
    const mutes = await Mute.destroy({ where: { userId } });
    const reports = await Report.destroy({ where: { userId } });
    const warns = await Warn.destroy({ where: { userId } });

    const embed = new EmbedBuilder()
      .setTitle(`Sanctions supprimées pour ${user.tag}`)
      .setColor('#FF0000') // Utilisation de la valeur hexadécimale pour la couleur rouge
      .setDescription(`Toutes les sanctions pour ${user.tag} ont été supprimées.`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};