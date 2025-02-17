const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createActionRow(currentIndex, totalSuggestions) {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('Précédente')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentIndex === 0),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Suivante')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentIndex === totalSuggestions - 1),
      new ButtonBuilder()
        .setCustomId('accept')
        .setLabel('Accepter')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('reject')
        .setLabel('Refuser')
        .setStyle(ButtonStyle.Danger)
    );
}

module.exports = { createActionRow };