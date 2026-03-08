// src/commands/leaderboard.js
const { getLeaderboard } = require('../database/db');
const { buildLeaderboardEmbed, buildErrorEmbed } = require('../utils/embeds');

module.exports = {
  name: 'leaderboard',
  description: "View Larry's PEENAR Empire leaderboard",

  async execute(message) {
    try {
      const rows = await getLeaderboard(10);
      return message.reply({ embeds: [buildLeaderboardEmbed(rows)] });
    } catch (err) {
      console.error('[leaderboard] Error:', err);
      return message.reply({ embeds: [buildErrorEmbed('Evil Larry could not load the leaderboard.')] });
    }
  },
};
