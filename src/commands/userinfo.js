const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      description: 'Affiche les informations d\'un utilisateur',
      type: 'SLASH_COMMAND',
      category: 'membre',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur dont vous souhaitez voir les informations',
          type: 6, // USER type
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`Informations sur l'utilisateur: ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Nom d\'utilisateur', value: user.tag, inline: true },
        { name: 'ID de l\'utilisateur', value: user.id, inline: true },
        { name: 'Créé le', value: `${user.createdAt.toDateString()}`, inline: true },
        { name: 'A rejoint le', value: `${member.joinedAt.toDateString()}`, inline: true },
        { name: 'Rôles', value: member.roles.cache.map(role => role.name).join(', '), inline: true }
      )
      .setColor('#0000FF'); // Utilisation de la valeur hexadécimale pour la couleur bleue

    return interaction.reply({ embeds: [embed] });
  }
};