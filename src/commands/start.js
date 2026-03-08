// src/commands/start.js
const { upsertUser } = require('../database/db');
const { buildStartEmbed, buildAlreadyRegisteredEmbed, buildErrorEmbed } = require('../utils/embeds');

module.exports = {
  name: 'start',
  description: 'Register yourself in the PEENAR economy',

  async execute(message) {
    const member = message.member || message.author;
    const user = message.author;

    try {
      const avatarUrl = user.displayAvatarURL({ dynamic: true });
      const { user: dbUser, isNew } = await upsertUser(user.id, user.username, avatarUrl);

      if (!isNew) {
        return message.reply({ embeds: [buildAlreadyRegisteredEmbed(message.member)] });
      }

      return message.reply({ embeds: [buildStartEmbed(dbUser, message.member)] });

    } catch (err) {
      console.error('[start] Error:', err);
      return message.reply({ embeds: [buildErrorEmbed('Evil Larry encountered an error. Try again later.')] });
    }
  },
};
