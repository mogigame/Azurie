# Azurie - Bot Modérateur pour Discord

Azurie est un bot modérateur conçu pour simplifier la gestion des serveurs Discord. Il offre des fonctionnalités puissantes pour la gestion des utilisateurs et la modération des conversations.

## 📌 Fonctionnalités

### 🔹 Modération
- `ban` → Bannir un membre.
- `unban` → Débannir un membre.
- `ban-list` → Voir la liste des bannis.
- `kick` → Expulser un membre.
- `mute` → Rendre un membre muet.
- `unmute` → Redonner la parole à un membre.
- `warn` → Avertir un membre.
- `sanctionlist` → Voir les avertissements d’un membre.
- `sanctionclear` → Supprimer les avertissements d’un membre.

### 🔹 Gestion des salons et des messages
- `lock` → Verrouiller un salon.
- `unlock` → Déverrouiller un salon.
- `clear` → Supprimer un certain nombre de messages.
- `purge` → Supprimer un grand nombre de messages rapidement.

### 🔹 Gestion des logs et de la configuration
- `change-log-channel` → Définir le salon des logs.
- `change-welcome-channel` → Définir le salon de bienvenue.
- `change-role-member` → Définir le rôle attribué aux nouveaux membres.

### 🔹 Système de bienvenue
- Message de bienvenue automatique.
- Attribution automatique d’un rôle aux nouveaux membres.

### 🔹 Système de tickets 🎫
- `ticket` → Ouvrir un ticket.
- `change-open-ticket-categorie` → Modifier la catégorie des tickets ouverts.

### 🔹 Système de suggestions 💡
- `suggestion` → Proposer une suggestion.
- `view-suggestions` → Voir toutes les suggestions.
- `view-accepted-suggestions` → Voir les suggestions acceptées.
- `change-suggestion-channel` → Modifier le salon des suggestions.

### 🔹 Informations & Rapports
- `userinfo` → Voir les infos d’un membre.
- `serverinfo` → Voir les infos du serveur.
- `report` → Signaler un membre.

## 🚀 Installation

### 1. Cloner le repository
Commencez par cloner le projet sur votre machine :
```bash
git clone https://github.com/votre-compte/azure-bot.git
cd Azurie
```
### 2. Installer les dépendances
```bash
npm i
npm i -g nodemon
```
### 3. Configurer le bot

Dans le dossier `src` du projet, vous devez créer un fichier `config.json`. Ce fichier contient des informations essentielles comme le token du bot, qui permet à Discord d’authentifier votre bot.

#### Récupérer le token du bot :
1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications).
2. Sélectionnez votre application, puis allez dans **Bot**.
3. Cliquez sur **Reset Token**, puis copiez le token généré.

Ajoutez ces informations dans le fichier `config.json` :
```json
{
  "DISCORD_TOKEN": "TOKEN",
  "database": {
    "host": "IP de la base de données",
    "user": "Utilisateur de la base de données",
    "password": "Mot de passe de la base de données",
    "name": "Nom de la base de données"
  },
  "roleMembreId": "ID du rôle membre (modifiable avec /change-role-member)",
  "logChannelId": "ID du canal des logs (modifiable avec /change-log-channel)",
  "welcomeChannelId": "ID du canal de bienvenue (modifiable avec /change-welcome-channel)",
  "suggestionChannelId": "ID du canal des suggestions (modifiable avec /change-suggestion-channel)",
  "openTicketCategoryId": "ID de la catégorie ouverte des tickets (modifiable avec /change-ticket-categories)",
  "closedTicketCategoryId": "ID de la catégorie fermée des tickets (modifiable avec /change-ticket-categories)",
  "archiveTicketCategoryId": "ID de la catégorie archive des tickets (modifiable avec /change-ticket-categories)",
  "archiveTicketChannelId": "ID du canal archive des tickets (modifiable avec /change-ticket-categories)"
}
```
⚠ **Ne partagez jamais votre token !** Si quelqu'un obtient votre token, il pourra contrôler votre bot.

### 4. Lancer le bot
```bash
npm run dev
```

## 📜 Licence
Ce projet est sous licence MIT. Vous êtes libre de le modifier et de l’améliorer !

---

💡 **Suggestions ou problèmes ?** Ouvrez une issue ou contactez le support du serveur !
