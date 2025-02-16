const { Event } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = class GuildMemberAddEvent extends Event {
  constructor(client) {
    super(client, 'guildMemberAdd', {
      description: 'Déclenché lorsqu\'un utilisateur rejoint le serveur',
    });
  }

  async execute(member) {
    const role = member.guild.roles.cache.get(config.roleMembreId);
    const logChannel = member.guild.channels.cache.get(config.logChannelId);
    const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannelId);

    if (!role) {
      console.log('Le rôle membre n\'a pas été trouvé.');
      return;
    }

    await member.roles.add(role);
    logChannel.send(`${member.user.tag} a rejoint le serveur et le rôle membre lui a été attribué.`);
    await member.send(`Bienvenue sur le serveur Etherna ! Le rôle ${role.name} vous a été attribué. Lisez les règles et réagissez au message pour accéder aux salons !`);

    if (welcomeChannel) {
      const welcomeEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Bienvenue sur Etherna !')
        .setDescription(`Bienvenue ${member.user.tag} ! Nous sommes ravis de vous accueillir. N'oubliez pas de lire et de réspecter les règles.`)
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'Rejoignez la discussion !', value: 'Participez aux discussions et faites connaissance avec les autres membres.' }
        )
        .setFooter({ text: 'Bienvenue sur Etherna'})
        .setTimestamp();

      welcomeChannel.send({ embeds: [welcomeEmbed] });
    } else {
      console.log('Le salon de bienvenue n\'a pas été trouvé.');
    }
  }
};