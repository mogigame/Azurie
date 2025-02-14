const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const Ban = require('../../models/Ban');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      description: 'Bannir un utilisateur',
      type: 'SLASH_COMMAND',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur que vous souhaitez bannir',
          type: 6, // USER type
          required: true,
        },
        {
          name: 'raison',
          description: 'La raison du bannissement',
          type: 3, // STRING type
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const reason = interaction.options.getString('raison');
    const userId = user.id;
    const moderatorId = interaction.user.id; // ID du modérateur qui effectue le bannissement

    await Ban.create({
      userId,
      moderatorId,
      reason,
      timestamp: new Date(),
      active: true,
    });

    await interaction.guild.members.ban(user, { reason });

    const embed = new EmbedBuilder()
      .setTitle(`Utilisateur banni: ${user.tag}`)
      .setColor('#FF0000') // Utilisation de la valeur hexadécimale pour la couleur rouge
      .setDescription(`${user.tag} a été banni pour la raison suivante: ${reason}`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};