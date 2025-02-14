const sequelize = require('./database'); // Importez l'instance de sequelize
const User = require('./models/User'); // Importez vos modèles

async function initDatabase() {
  try {
    // Connectez-vous à la base de données MariaDB (MySQL)
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');

    // Synchronisez les modèles avec la base de données
    await sequelize.sync({ alter: true }); // Utilisez { alter: true } pour éviter la perte de données
    console.log('Les modèles ont été synchronisés avec la base de données.');

    // Exemple d'utilisation du modèle User
    const newUser = await User.create({ username: 'JohnDoe', email: 'john.doe@example.com' });
    console.log(`Nouvel utilisateur créé : ${newUser.username}`);
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
  } finally {
    // Fermez la connexion à la base de données
    await sequelize.close();
  }
}

// Exécutez la fonction initDatabase
initDatabase();