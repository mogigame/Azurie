const { ShewenyClient } = require("sheweny");
const config = require("./config.json");

const client = new ShewenyClient({
  intents: [
    "Guilds",
    "GuildMessages",
    "GuildMembers",
    "GuildIntegrations",
    "GuildInvites",
    "GuildMessageReactions",
    "GuildVoiceStates",
    "GuildWebhooks",
    "GuildPresences",
    "GuildMessageTyping",
    "GuildBans",
    "DirectMessages",
    "DirectMessageReactions",
    "DirectMessageTyping"
  ],
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      prefix: "!",
      
    },
    events: {
      directory: "./events",
    },
    buttons: {
      directory: "./interactions/buttons",
    },
    selectMenus: {
      directory: "./interactions/selectmenus",
    },
    modals: {
      directory: "./interactions/modals",
    },
    inhibitors: {
      directory: "./inhibitors",
    },
  },
  mode : "development", // Change to production for production bot
});


client.config = config;

client.login(config.DISCORD_TOKEN);
