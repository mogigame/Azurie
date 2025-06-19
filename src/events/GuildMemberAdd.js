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

    // Envoi dans le salon de logs seulement si il existe
    if (logChannel) {
      logChannel.send(`${member.user.tag} a rejoint le serveur et le rôle membre lui a été attribué.`);
    }

    // Essaye d'envoyer un MP, ignore si l'utilisateur bloque les MP
    try {
      await member.send(`Bienvenue sur le serveur Etherna ! Le rôle ${role.name} vous a été attribué. Lisez les règles et réagissez au message pour accéder aux salons !`);
    } catch (e) {
      // Optionnel : log si tu veux savoir qui ne reçoit pas les MP
      console.log(`Impossible d'envoyer un MP à ${member.user.tag}.`);
    }

    if (welcomeChannel) {
      const welcomeEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Bienvenue sur Etherna !')
        .setDescription(`Bienvenue ${member.user.tag} ! Nous sommes ravis de vous accueillir. N'oubliez pas de lire et de respecter les règles.`)
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