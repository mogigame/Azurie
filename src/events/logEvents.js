const { Event } = require('sheweny');

module.exports = class LoggingEvents extends Event {
  constructor(client) {
    super(client, 'all', {
      description: 'Déclenché pour diverses actions sur le serveur',
    });
  }

  async execute(event, ...args) {
    const logChannel = this.client.channels.cache.get(this.client.config.logChannelId);

    if (!logChannel) return;

    switch (event) {
      case 'guildMemberRemove':
        const member = args[0];
        logChannel.send(`${member.user.tag} a quitté le serveur.`);
        break;
      case 'messageDelete':
        const message = args[0];
        logChannel.send(`Un message de ${message.author.tag} a été supprimé dans ${message.channel.name} : "${message.content}"`);
        break;
      case 'messageUpdate':
        const oldMessage = args[0];
        const newMessage = args[1];
        logChannel.send(`Un message de ${oldMessage.author.tag} a été modifié dans ${oldMessage.channel.name} : "${oldMessage.content}" -> "${newMessage.content}"`);
        break;
      case 'guildBanAdd':
        const ban = args[0];
        logChannel.send(`${ban.user.tag} a été banni du serveur.`);
        break;
      case 'guildBanRemove':
        const unban = args[0];
        logChannel.send(`${unban.user.tag} a été débanni du serveur.`);
        break;
      default:
        break;
    }
  }
};