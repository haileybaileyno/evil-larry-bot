// src/commands/chamber.js
const { getUser, destroyPeenar } = require('../database/db');
const { buildChamberEmbed, buildErrorEmbed } = require('../utils/embeds');

module.exports = {
  name: 'chamber',
  description: "Throw stolen PEENAR into Evil Larry's Explosion Chamber",

  async execute(message) {
    const user = message.author;

    // Must mention a user (whose PEENAR to destroy)
    const targetMember = message.mentions.members?.first();
    if (!targetMember) {
      return message.reply({
        embeds: [buildErrorEmbed('You must mention a user whose PEENAR to destroy! Usage: `elc chamber @user`')]
      });
    }

    const target = targetMember.user;

    // Can't destroy your own PEENAR
    if (user.id === target.id) {
      return message.reply({
        embeds: [buildErrorEmbed('🐱 Evil Larry scoffs. You cannot destroy your OWN PEENAR. Only stolen PEENAR may enter the chamber.')]
      });
    }

    try {
      // Check destroyer is registered
      const destroyerDb = await getUser(user.id);
      if (!destroyerDb) {
        return message.reply({ embeds: [buildErrorEmbed('You must register first! Run `elc start`.')] });
      }

      // Check they have stolen PEENAR
      if (destroyerDb.stolen_peenar < 1) {
        return message.reply({
          embeds: [buildErrorEmbed(
            '😈 You have no **stolen PEENAR** to destroy.\n\n' +
            'Only PEENAR stolen from other users can be thrown into the chamber.\n' +
            'Use `elc steal @user` first!'
          )]
        });
      }

      // Check target is registered
      const targetDb = await getUser(target.id);
      if (!targetDb) {
        return message.reply({
          embeds: [buildErrorEmbed(`**${target.username}** is not registered in the PEENAR economy.`)]
        });
      }

      // Execute destruction
      const evilData = await destroyPeenar(user.id, target.id);

      return message.reply({ embeds: [buildChamberEmbed(message.member, targetMember, evilData)] });

    } catch (err) {
      if (err.message === 'NO_STOLEN_PEENAR') {
        return message.reply({
          embeds: [buildErrorEmbed('You have no stolen PEENAR to destroy! Steal some first with `elc steal @user`.')]
        });
      }
      console.error('[chamber] Error:', err);
      return message.reply({ embeds: [buildErrorEmbed('The chamber malfunctioned. Evil Larry is furious.')] });
    }
  },
};
