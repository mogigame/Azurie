const { Sequelize } = require('sequelize');
const config = require('../config.json');

// Initialiser la base de données MariaDB (MySQL)
const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
  host: config.database.host,
  dialect: 'mysql',
  logging: false,
});

// Exporter l'instance Sequelize pour l'utiliser dans d'autres fichiers
module.exports = sequelize;