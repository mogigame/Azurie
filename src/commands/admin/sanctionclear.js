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
    let logChannel;
    if (this.client.config && this.client.config.logChannelId) {
      logChannel = interaction.guild.channels.cache.get(this.client.config.logChannelId);
    }

    await Ban.destroy({ where: { userId } });
    await Mute.destroy({ where: { userId } });
    await Report.destroy({ where: { userId } });
    await Warn.destroy({ where: { userId } });

    const embed = new EmbedBuilder()
      .setTitle(`Sanctions supprimées pour ${user.tag}`)
      .setColor('#FF0000')
      .setDescription(`Toutes les sanctions pour ${user.tag} ont été supprimées.`)
      .setTimestamp();

    if (logChannel) {
      logChannel.send(`${interaction.user.tag} a supprimé toutes les sanctions pour ${user.tag}.`);
    } else {
      console.log('Salon de logs introuvable pour journaliser la suppression des sanctions.');
    }
    return interaction.reply({ embeds: [embed] });
  }
};