const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const Ban = require('../../models/Ban');

module.exports = class UnbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      description: 'Débannir un utilisateur',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur que vous souhaitez débannir',
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

    const ban = await Ban.findOne({ where: { userId, active: true } });

    if (!ban) {
      return interaction.reply(`L'utilisateur ${user.tag} n'est pas banni.`);
    }

    await Ban.update({ active: false }, { where: { userId } });

    await interaction.guild.members.unban(user);

    const embed = new EmbedBuilder()
      .setTitle(`Utilisateur débanni: ${user.tag}`)
      .setColor('#00FF00')
      .setDescription(`${user.tag} a été débanni avec succès.`)
      .setTimestamp();

    if (logChannel) {
      logChannel.send(`${interaction.user.tag} a débanni ${user.tag}.`);
    }
    return interaction.reply({ embeds: [embed] });
  }
};