// src/events/messageCreate.js
// Routes all "elc" prefix commands to the right handler

const startCmd        = require('../commands/start');
const profileCmd      = require('../commands/profile');
const stealCmd        = require('../commands/steal');
const chamberCmd      = require('../commands/chamber');
const summonJamesCmd  = require('../commands/summonjames');
const leaderboardCmd  = require('../commands/leaderboard');
const { buildErrorEmbed } = require('../utils/embeds');

const PREFIX = 'elc ';

// Map of command strings → handlers
// Multi-word commands must come before single-word to match greedily
const COMMANDS = [
  { trigger: 'summon james', handler: summonJamesCmd },
  { trigger: 'start',        handler: startCmd },
  { trigger: 'profile',      handler: profileCmd },
  { trigger: 'steal',        handler: stealCmd },
  { trigger: 'chamber',      handler: chamberCmd },
  { trigger: 'leaderboard',  handler: leaderboardCmd },
];

const HELP_TEXT = `
🐱 **Evil Larry Command List (ELC)**

\`elc start\` — Register in the PEENAR economy
\`elc profile\` — View your PEENAR profile
\`elc steal @user\` — Steal a PEENAR from someone (50% chance, 30min cooldown)
\`elc chamber @user\` — Throw stolen PEENAR into the Explosion Chamber
\`elc summon james\` — Summon Evil James to protect your PEENAR (1 hour)
\`elc leaderboard\` — See Larry's PEENAR Empire rankings

😈 *Evil Larry is watching.*
`;

module.exports = {
  name: 'messageCreate',

  async execute(message) {
    // Ignore bots and messages that don't start with prefix
    if (message.author.bot) return;

    const content = message.content.toLowerCase().trim();

    // Bare "elc" or "elc help"
    if (content === 'elc' || content === 'elc help') {
      return message.reply(HELP_TEXT);
    }

    if (!content.startsWith(PREFIX)) return;

    // Strip the "elc " prefix
    const body = content.slice(PREFIX.length).trim();

    // Find matching command
    for (const cmd of COMMANDS) {
      if (body === cmd.trigger || body.startsWith(cmd.trigger + ' ')) {
        const args = body.slice(cmd.trigger.length).trim().split(/\s+/);
        try {
          return await cmd.handler.execute(message, args);
        } catch (err) {
          console.error(`[messageCreate] Unhandled error in ${cmd.trigger}:`, err);
          return message.reply({ embeds: [buildErrorEmbed('Evil Larry encountered an unexpected error.')] });
        }
      }
    }

    // Unknown command
    return message.reply({
      embeds: [buildErrorEmbed(`Unknown command. Type \`elc help\` to see what Evil Larry allows. 🐱`)]
    });
  },
};
