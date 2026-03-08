// src/events/ready.js
// Bot ready event + daily Evil Larry tax cron job

const cron = require('node-cron');
const { randomLarryTax } = require('../database/db');
const { buildTaxEmbed } = require('../utils/embeds');

module.exports = {
  name: 'ready',
  once: true,

  async execute(client) {
    console.log(`\n🐱 Evil Larry is online as: ${client.user.tag}`);
    console.log(`😈 Watching ${client.guilds.cache.size} server(s)...`);

    client.user.setActivity('your PEENAR | elc help', { type: 3 }); // WATCHING

    // ─── Daily Larry Tax (runs every 24 hours at noon UTC) ─────────────────────
    cron.schedule('0 12 * * *', async () => {
      console.log('🐱 [CRON] Evil Larry Tax triggered...');

      try {
        const victim = await randomLarryTax();
        if (!victim) {
          console.log('[CRON] No users with PEENAR found for tax.');
          return;
        }

        const embed = buildTaxEmbed(victim);

        // Broadcast to all guilds' system channel or first available text channel
        for (const guild of client.guilds.cache.values()) {
          const channel =
            guild.systemChannel ||
            guild.channels.cache
              .filter(c => c.isTextBased() && c.permissionsFor(guild.members.me)?.has('SendMessages'))
              .first();

          if (channel) {
            await channel.send({ embeds: [embed] }).catch(console.error);
          }
        }

        console.log(`[CRON] Larry taxed: ${victim.username}`);
      } catch (err) {
        console.error('[CRON] Tax error:', err);
      }
    });

    console.log('⏰ Evil Larry daily tax cron scheduled (noon UTC).');
  },
};
