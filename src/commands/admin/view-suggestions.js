const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const Suggestion = require('../../models/Suggestion');
const { createActionRow } = require('../../interactions/buttons/viewSuggestionsButtons');

module.exports = class ViewSuggestionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'view-suggestions',
      description: 'Voir les suggestions une par une et les gérer',
      type: 'SLASH_COMMAND',
    });
    this.suggestions = [];
    this.currentIndex = 0;
  }

  async execute(interaction) {
    this.suggestions = await Suggestion.findAll({ where: { status: 'pending' } });
    this.currentIndex = 0;

    if (this.suggestions.length === 0) {
      return interaction.reply('Aucune suggestion en attente.');
    }

    const suggestion = this.suggestions[this.currentIndex];
    const embed = this.createEmbed(suggestion);
    const row = createActionRow(this.currentIndex, this.suggestions.length);

    await interaction.reply({ embeds: [embed], components: [row] });

    const filter = (i) => 
      i.customId === 'previous' || 
      i.customId === 'next' || 
      i.customId === 'accept' || 
      i.customId === 'reject';
    
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: "Vous ne pouvez pas utiliser ces boutons.", ephemeral: true });
      }
      await this.handleButtonInteraction(i);
    });

    collector.on('end', async () => {
      // Disable buttons after the collector ends
      const disabledRow = createActionRow(this.currentIndex, this.suggestions.length);
      disabledRow.components.forEach((component) => component.setDisabled(true));
      await interaction.editReply({ components: [disabledRow] });
    });
  }

  createEmbed(suggestion) {
    const formattedTimestamp = new Date(suggestion.timestamp).toLocaleString('fr-FR', { timeZone: 'UTC' });

    return new EmbedBuilder()
      .setTitle('Suggestion en attente')
      .setColor('#0000FF')
      .setDescription(suggestion.suggestion)
      .addFields(
        { name: 'Utilisateur', value: `<@${suggestion.userId}>`, inline: true },
        { name: 'Date', value: formattedTimestamp, inline: true }
      )
      .setFooter({ text: `Suggestion ${this.currentIndex + 1} sur ${this.suggestions.length}` });
  }

  async handleButtonInteraction(interaction) {
    const suggestion = this.suggestions[this.currentIndex];

    if (interaction.customId === 'previous') {
      this.currentIndex--;
    } else if (interaction.customId === 'next') {
      this.currentIndex++;
    } else if (interaction.customId === 'accept') {
      await Suggestion.update({ status: 'accepted' }, { where: { id: suggestion.id } });
      this.suggestions.splice(this.currentIndex, 1);
      if (this.currentIndex >= this.suggestions.length) this.currentIndex--;
    } else if (interaction.customId === 'reject') {
      await Suggestion.update({ status: 'rejected' }, { where: { id: suggestion.id } });
      this.suggestions.splice(this.currentIndex, 1);
      if (this.currentIndex >= this.suggestions.length) this.currentIndex--;
    }

    if (this.suggestions.length === 0) {
      return interaction.update({ content: 'Toutes les suggestions ont été traitées.', embeds: [], components: [] });
    }

    const newSuggestion = this.suggestions[this.currentIndex];
    const embed = this.createEmbed(newSuggestion);
    const row = createActionRow(this.currentIndex, this.suggestions.length);

    try {
      await interaction.update({ embeds: [embed], components: [row] });
    } catch (error) {
      if (error.code === 10062) {
        // Interaction has expired, handle the error gracefully
        console.error('Interaction has expired:', error);
      } else {
        throw error;
      }
    }
  }
};