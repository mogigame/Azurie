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

    if (!role) {
      console.log('Le rôle membre n\'a pas été trouvé.');
    }

    await member.roles.add(role);
    await member.send(`Bienvenue sur le serveur Etherna ! Le rôle ${role.name} vous a été attribué, lisez les règles et réagissez au message pour accéder au salon !`);
  }
};