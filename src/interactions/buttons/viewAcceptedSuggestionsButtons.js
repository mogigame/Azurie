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
        .setCustomId('markDone')
        .setLabel('Marquer comme fait')
        .setStyle(ButtonStyle.Secondary)
    );
}

module.exports = { createActionRow };