// src/commands/steal.js
const { getUser, canSteal, executeSteal, checkAndExpireProtection } = require('../database/db');
const { buildStealSuccessEmbed, buildStealFailEmbed, buildErrorEmbed } = require('../utils/embeds');

module.exports = {
  name: 'steal',
  description: 'Steal a PEENAR from another user',

  async execute(message, args) {
    const attacker = message.author;

    // Must mention a target
    const targetMember = message.mentions.members?.first();
    if (!targetMember) {
      return message.reply({ embeds: [buildErrorEmbed('You must mention a user to steal from! Usage: `elc steal @user`')] });
    }

    const target = targetMember.user;

    // Can't steal from yourself
    if (attacker.id === target.id) {
      return message.reply({ embeds: [buildErrorEmbed('🐱 Evil Larry laughs. You cannot steal from yourself, you fool.')] });
    }

    // Can't steal from bots
    if (target.bot) {
      return message.reply({ embeds: [buildErrorEmbed('🐱 Evil Larry refuses. You cannot steal from bots.')] });
    }

    try {
      // Check attacker is registered
      const attackerDb = await getUser(attacker.id);
      if (!attackerDb) {
        return message.reply({ embeds: [buildErrorEmbed('You must register first! Run `elc start`.')] });
      }

      // Check target is registered
      const victimDb = await getUser(target.id);
      if (!victimDb) {
        return message.reply({ embeds: [buildErrorEmbed(`**${target.username}** is not in the PEENAR economy yet. They must run \`elc start\` first.`)] });
      }

      // Check target protection
      const isProtected = await checkAndExpireProtection(victimDb);
      if (isProtected) {
        return message.reply({
          embeds: [buildErrorEmbed(`🛡 **${target.username}** is protected by Evil James! Your PEENAR remains yours... for now.`)]
        });
      }

      // Check steal cooldown
      const stealCheck = await canSteal(attacker.id);
      if (!stealCheck.canSteal) {
        if (stealCheck.reason === 'cooldown') {
          return message.reply({
            embeds: [buildErrorEmbed(`🐱 Evil Larry says WAIT. You must wait **${stealCheck.remaining} more minutes** before stealing again.`)]
          });
        }
      }

      // Execute the steal
      const success = await executeSteal(attacker.id, target.id);

      if (success) {
        return message.reply({ embeds: [buildStealSuccessEmbed(message.member, targetMember)] });
      } else {
        return message.reply({ embeds: [buildStealFailEmbed(message.member, targetMember)] });
      }

    } catch (err) {
      console.error('[steal] Error:', err);
      return message.reply({ embeds: [buildErrorEmbed('Evil Larry encountered an error during the heist.')] });
    }
  },
};
