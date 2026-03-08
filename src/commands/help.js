// src/commands/help.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Shows all Evil Larry commands and bot info',

  async execute(message) {
    const embed = new EmbedBuilder()
      .setTitle('🐱 Evil Larry Cat — Command Center')
      .setDescription(
        '*Evil Larry reluctantly shows you how his empire works...*\n\n' +
        '> All commands start with **`elc`**\n' +
        '> Evil Larry is always watching. 😈'
      )
      .setColor(0xFF0000)
      .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))

      .addFields(
        {
          name: '─────────────────────────',
          value: '**📋 GENERAL COMMANDS**',
        },
        {
          name: '`elc start`',
          value: 'Register yourself in the PEENAR economy. Evil Larry will notice you.',
          inline: false,
        },
        {
          name: '`elc profile`',
          value: 'View your PEENAR balance, status, evil level and protection.',
          inline: false,
        },
        {
          name: '`elc leaderboard`',
          value: "See who runs Larry's PEENAR Empire. Top 10 holders.",
          inline: false,
        },

        {
          name: '─────────────────────────',
          value: '**⚔️ ATTACK COMMANDS**',
        },
        {
          name: '`elc steal @user`',
          value: '50% chance to steal 1 PEENAR from someone.\n⏱ 30 minute cooldown. Victim becomes **Larrified** 😵',
          inline: false,
        },
        {
          name: '`elc chamber @user`',
          value: 'Destroy a stolen PEENAR in the Explosion Chamber 💥\nGains you **Evil Points** and raises your **Evil Level**.\nOnly stolen PEENAR can be destroyed.',
          inline: false,
        },

        {
          name: '─────────────────────────',
          value: '**🛡 DEFENSE COMMANDS**',
        },
        {
          name: '`elc summon james`',
          value: 'Summon Evil James to guard your PEENAR for **1 hour**.\nNo one can steal from you while he watches.',
          inline: false,
        },

        {
          name: '─────────────────────────',
          value: '**😈 EVIL LEVEL RANKS**',
        },
        {
          name: 'Rank System',
          value:
            '`0 pts` — Innocent Fool 😇\n' +
            '`1 pt`  — Larry Follower 🐱\n' +
            '`3 pts` — Junior Menace 😈\n' +
            '`5 pts` — Chaos Agent 🔥\n' +
            '`10 pts` — True Evil 💀\n' +
            '`20 pts` — Disciple of Larry 👑',
          inline: false,
        },

        {
          name: '─────────────────────────',
          value: '**🤖 BOT INFO**',
        },
        {
          name: 'About Evil Larry Cat',
          value:
            '**Creator:** Evil Larry himself 🐱\n' +
            '**Currency:** PEENAR 💰\n' +
            '**Prefix:** `elc`\n' +
            '**Daily Event:** Evil Larry randomly taxes 1 user every 24 hours\n' +
            '**Status Effect:** Get stolen from = become **Larrified** 😵',
          inline: false,
        },
      )
      .setFooter({ text: 'Evil Larry is always watching. 🐱 | Use elc start to join!' })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};
