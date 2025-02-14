const { Event } = require("sheweny");
const sequelize = require('../database'); // Importez l'instance de sequelize

module.exports = class ReadyEvent extends Event {
  constructor(client) {
    super(client, "ready", {
      description: "Client is logged in",
      once: true,
      emitter: client,
    });
  }

  async execute() {
    console.log(`${this.client.user.tag} is logged in`);

    // Connectez-vous à la base de données MariaDB (MySQL)
    try {
      await sequelize.authenticate();
      console.log('Connexion à la base de données réussie.');

      // Synchronisez les modèles avec la base de données
      await sequelize.sync();
      console.log('Les modèles ont été synchronisés avec la base de données.');

    } catch (error) {
      console.error('Impossible de se connecter à la base de données :', error);
    }
  }
};