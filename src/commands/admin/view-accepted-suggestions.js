const { Command } = require('sheweny');
const { EmbedBuilder } = require('discord.js');
const Suggestion = require('../../models/Suggestion');
const { createActionRow } = require('../../interactions/buttons/viewAcceptedSuggestionsButtons');

module.exports = class ViewAcceptedSuggestionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'view-accepted-suggestions',
      description: 'Voir les suggestions acceptées une par une',
      type: 'SLASH_COMMAND',
    });
    this.suggestions = [];
    this.currentIndex = 0;
  }

  async execute(interaction) {
    this.suggestions = await Suggestion.findAll({ where: { status: 'accepted' } });
    this.currentIndex = 0;

    if (this.suggestions.length === 0) {
      return interaction.reply({ content: 'Aucune suggestion acceptée.', flags: 64 });
    }

    const suggestion = this.suggestions[this.currentIndex];
    const embed = this.createEmbed(suggestion);
    const row = createActionRow(this.currentIndex, this.suggestions.length);

    await interaction.reply({ embeds: [embed], components: [row] });

    const filter = (i) => 
      i.customId === 'previous' || 
      i.customId === 'next' || 
      i.customId === 'markDone';
    
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: "Vous ne pouvez pas utiliser ces boutons.", flags: 64 });
      }
      await this.handleButtonInteraction(i);
    });

    collector.on('end', async () => {
      // Désactive les boutons après la fin du collector
      const disabledRow = createActionRow(this.currentIndex, this.suggestions.length);
      disabledRow.components.forEach((component) => component.setDisabled(true));
      try {
        await interaction.editReply({ components: [disabledRow] });
      } catch (e) {
        // ignore l'erreur si le message n'existe plus ou déjà édité
      }
    });
  }

  createEmbed(suggestion) {
    const formattedTimestamp = new Date(suggestion.timestamp).toLocaleString('fr-FR', { timeZone: 'UTC' });

    return new EmbedBuilder()
      .setTitle('Suggestion acceptée')
      .setColor('#00FF00')
      .setDescription(suggestion.suggestion)
      .addFields(
        { name: 'Utilisateur', value: `<@${suggestion.userId}>`, inline: true },
        { name: 'Date', value: formattedTimestamp, inline: true }
      )
      .setFooter({ text: `Suggestion ${this.currentIndex + 1} sur ${this.suggestions.length}` });
  }

  async handleButtonInteraction(interaction) {
    if (interaction.customId === 'previous') {
      this.currentIndex--;
    } else if (interaction.customId === 'next') {
      this.currentIndex++;
    } else if (interaction.customId === 'markDone') {
      await Suggestion.update({ status: 'done' }, { where: { id: this.suggestions[this.currentIndex].id } });
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
      if (error.code === 10062 || error.code === 40060) {
        // Interaction expirée ou déjà acquittée
        console.error('Interaction expired or already acknowledged:', error);
      } else {
        throw error;
      }
    }
  }
};