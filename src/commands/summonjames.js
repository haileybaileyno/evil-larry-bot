// src/commands/summonjames.js
const { getUser, setProtection, checkAndExpireProtection } = require('../database/db');
const { buildJamesEmbed, buildErrorEmbed } = require('../utils/embeds');

module.exports = {
  name: 'summon james',
  description: 'Summon Evil James to protect your PEENAR for 1 hour',

  async execute(message) {
    const user = message.author;

    try {
      const dbUser = await getUser(user.id);

      if (!dbUser) {
        return message.reply({ embeds: [buildErrorEmbed('You must register first! Run `elc start`.')] });
      }

      // Check if already protected
      const isProtected = await checkAndExpireProtection(dbUser);
      if (isProtected) {
        const expiry = new Date(dbUser.protection_expires_at);
        const minutesLeft = Math.ceil((expiry - Date.now()) / 60000);
        return message.reply({
          embeds: [buildErrorEmbed(`🛡 Evil James is already guarding your PEENAR! Protection expires in **${minutesLeft} minutes**.`)]
        });
      }

      // Activate James protection for 1 hour
      await setProtection(user.id, true, 60 * 60 * 1000);

      return message.reply({ embeds: [buildJamesEmbed(message.member)] });

    } catch (err) {
      console.error('[summon james] Error:', err);
      return message.reply({ embeds: [buildErrorEmbed('Evil James could not be summoned. Try again later.')] });
    }
  },
};
