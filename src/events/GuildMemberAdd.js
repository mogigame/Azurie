const { Event } = require('sheweny');
const config = require('../config.json');

module.exports = class GuildMemberAddEvent extends Event {
  constructor(client) {
    super(client, 'guildMemberAdd', {
      description: 'Déclenché lorsqu\'un utilisateur rejoint le serveur',
    });
  }

  async execute(member) {
    const role = member.guild.roles.cache.get(config.roleMembreId);
    const logChannel = interaction.guild.channels.cache.get(this.client.config.logChannelId);

    if (!role) {
      console.log('Le rôle membre n\'a pas été trouvé.');
    }

    await member.roles.add(role);
    logChannel.send(`${member.user.tag} a rejoint le serveur et le role membre le lui a été attribuée.`);
    await member.send(`Bienvenue sur le serveur Etherna ! Le rôle ${role.name} vous a été attribué, lisez les règles et réagissez au message pour accéder au salon !`);
  }
};