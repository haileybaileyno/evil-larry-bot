// src/commands/profile.js
const { getUser, checkAndExpireProtection } = require('../database/db');
const { buildProfileEmbed, buildErrorEmbed } = require('../utils/embeds');

module.exports = {
  name: 'profile',
  description: "View your PEENAR profile under Evil Larry's gaze",

  async execute(message) {
    const user = message.author;

    try {
      let dbUser = await getUser(user.id);

      if (!dbUser) {
        return message.reply({
          embeds: [buildErrorEmbed('You are not in the PEENAR economy yet! Run `elc start` to register.')]
        });
      }

      // Check if protection has expired
      await checkAndExpireProtection(dbUser);
      // Re-fetch after potential update
      dbUser = await getUser(user.id);

      return message.reply({ embeds: [buildProfileEmbed(dbUser, message.member)] });

    } catch (err) {
      console.error('[profile] Error:', err);
      return message.reply({ embeds: [buildErrorEmbed('Evil Larry could not retrieve your profile.')] });
    }
  },
};
