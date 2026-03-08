// src/utils/embeds.js
// Reusable Discord embed builders for Evil Larry Cat Bot

const { EmbedBuilder } = require('discord.js');

// ─── Meme Image URLs ──────────────────────────────────────────────────────────
// Replace these with your actual hosted images or upload them to a Discord channel
// and copy the CDN URLs. These are placeholder descriptive URLs.
const IMAGES = {
  EVIL_LARRY:   'https://cdn.discordapp.com/attachments/1480233701324361860/1480235684622106644/LARRY_LE_MALICIEUX_sur_TikTok.jfif?ex=69aef068&is=69ad9ee8&hm=3f5aca9866d451a272b8a791ddf338a6ec2d1fcad5161e903d8a1b11ff69aab7&',  // Replace with real ELC meme
  EVIL_JAMES:   'https://cdn.discordapp.com/attachments/1480233701324361860/1480235684957782077/James.webp?ex=69aef068&is=69ad9ee8&hm=cfb5b0cd05c71730cb6c70893e911347139461929b662821f8ae6aa1934dea6f&',  // Replace with real ELC meme
  CHAMBER:      'https://cdn.discordapp.com//attachments1480233701324361860/1480235684332830890/download.jfif?ex=69aef068&is=69ad9ee8&hm=d9b957ac24067feff0bb38e00fe1f0b319ad1b32bf78af6f13d27fae7f25f5a1&',     // Replace with explosion chamber meme
};

// ─── Color Palette ────────────────────────────────────────────────────────────
const COLORS = {
  EVIL_RED:    0xFF0000,
  CHAOS_ORANGE:0xFF6600,
  JAMES_BLUE:  0x0099FF,
  GOLD:        0xFFD700,
  DARK:        0x2C2F33,
};

// ─── Footer Sayings ───────────────────────────────────────────────────────────
const FOOTERS = [
  'Evil Larry is always watching. 🐱',
  'Your PEENAR belongs to Larry. 😈',
  'No PEENAR is safe. 🔥',
  'Evil Larry feeds on your fear. 💥',
  'Bow to the Evil Larry. 🐱',
];

function randomFooter() {
  return FOOTERS[Math.floor(Math.random() * FOOTERS.length)];
}

// ─── Embed Builders ───────────────────────────────────────────────────────────

/**
 * Build the registration embed (elc start)
 */
function buildStartEmbed(user, member) {
  return new EmbedBuilder()
    .setTitle('🐱 Evil Larry Has Registered You')
    .setDescription(
      '> Welcome to the PEENAR economy.\n' +
      '> You have been noticed by Evil Larry.\n' +
      '> Save your PEENAR and steal others.\n' +
      '> Help Larry or get Larrified.\n\n' +
      '**You now belong to Evil Larry.** 😈'
    )
    .setColor(COLORS.EVIL_RED)
    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: '👤 User', value: `${member.user.username}.\n`, inline: false },
      { name: '💰 Starting PEENAR', value: '1.\n', inline: false },
      { name: '🔥 Status', value: 'Normal.\n', inline: false }
    )
    .setImage(IMAGES.EVIL_LARRY)
    .setFooter({ text: 'Evil Larry is always watching. 🐱' })
    .setTimestamp();
}

/**
 * Build the "already registered" embed
 */
function buildAlreadyRegisteredEmbed(member) {
  return new EmbedBuilder()
    .setTitle('🐱 Evil Larry Already Owns You')
    .setDescription('You are already part of the PEENAR economy. Evil Larry remembers you... 😈')
    .setColor(COLORS.CHAOS_ORANGE)
    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: randomFooter() });
}

/**
 * Build the profile embed (elc profile)
 */
function buildProfileEmbed(dbUser, member) {
  const protectionText = dbUser.protection_active ? '🛡 Active' : '❌ None';
  const statusText = dbUser.status === 'Larrified'
    ? 'Larrified 😵🐱'
    : 'Normal 😊';

  const { getEvilRank } = require('../database/db');
  const evilRank = getEvilRank(dbUser.evil_level);

  return new EmbedBuilder()
    .setTitle('🐱 Evil Larry Inspects Your Soul...')
    .setDescription(`**${member.user.username}**'s PEENAR profile — under Larry's gaze.`)
    .setColor(dbUser.status === 'Larrified' ? COLORS.EVIL_RED : COLORS.DARK)
    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    .addFields(
    { name: '💰 PEENAR', value: `${dbUser.peenar_balance}`, inline: false },
    { name: '🔥 Status', value: statusText, inline: false },
    { name: '🛡 Protection', value: protectionText, inline: false },
    { name: '😈 Evil Level', value: `${dbUser.evil_level} — ${evilRank}`, inline: false },
    { name: '💀 Stolen PEENAR Available', value: `${dbUser.stolen_peenar}`, inline: false },
  )
    .setFooter({ text: randomFooter() })
    .setTimestamp();
}

/**
 * Build steal SUCCESS embed
 */
function buildStealSuccessEmbed(attacker, victim) {
  return new EmbedBuilder()
    .setTitle('😈 Evil Larry Approves The Theft')
    .setDescription(
      `**${attacker.user.username}** stole a PEENAR from **${victim.user.username}**.\n\n` +
      `💀 **${victim.user.username}** has been **LARRIFIED**. 😵🐱`
    )
    .setColor(COLORS.EVIL_RED)
    .setThumbnail(attacker.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: '🥷 Thief', value: attacker.user.username, inline: true },
      { name: '😭 Victim', value: victim.user.username, inline: true },
    )
    .setFooter({ text: 'Evil Larry rewards the bold. 😈' })
    .setTimestamp();
}

/**
 * Build steal FAIL embed
 */
function buildStealFailEmbed(attacker, victim) {
  return new EmbedBuilder()
    .setTitle('🐱 Evil Larry Laughs At Your Pathetic Attempt')
    .setDescription(
      `**${attacker.user.username}** tried to steal from **${victim.user.username}**...\n\n` +
      `🤣 Evil Larry cackles. **${victim.user.username}** counter-stole your PEENAR instead!\n\n` +
      `**${attacker.user.username}** has been **LARRIFIED**. 😵`
    )
    .setColor(COLORS.CHAOS_ORANGE)
    .setThumbnail(attacker.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: 'Pathetic. Evil Larry is disappointed. 🐱' })
    .setTimestamp();
}

/**
 * Build chamber SUCCESS embed
 */
function buildChamberEmbed(destroyer, originalOwner, evilData) {
  return new EmbedBuilder()
    .setTitle('💥 PEENAR EXPLOSION CHAMBER ACTIVATED')
    .setDescription(
      '🔥 *Evil Larry has activated the forbidden chamber.*\n\n' +
      `**${destroyer.user.username}** has thrown **${originalOwner.user.username}**\'s PEENAR into the explosion chamber.\n\n` +
      `💥 The PEENAR has been **completely destroyed**.\n\n` +
      `😈 **${destroyer.user.username}** grows more evil…`
    )
    .setColor(COLORS.EVIL_RED)
    .setThumbnail(destroyer.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: '💀 Destroyed PEENAR Owner', value: originalOwner.user.username, inline: true },
      { name: '😈 Destroyed By', value: destroyer.user.username, inline: true },
      { name: '🔥 Evil Level', value: `${evilData.newEvilLevel} — ${evilData.evilRank}`, inline: false },
    )
    .setImage(IMAGES.CHAMBER)
    .setFooter({ text: 'Evil Larry feeds on destroyed PEENAR. 💥' })
    .setTimestamp();
}

/**
 * Build James summon embed
 */
function buildJamesEmbed(member) {
  return new EmbedBuilder()
    .setTitle('🛡 Evil James Has Been Summoned')
    .setDescription(
      '**Evil James** now guards your PEENAR.\n\n' +
      '🛡 No one can steal from you for **1 hour**.\n\n' +
      '*Evil James stares into the void, protecting your PEENAR with his entire being.*'
    )
    .setColor(COLORS.JAMES_BLUE)
    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    .setImage(IMAGES.EVIL_JAMES)
    .setFooter({ text: 'Evil James is watching your PEENAR. 🛡' })
    .setTimestamp();
}

/**
 * Build leaderboard embed
 */
function buildLeaderboardEmbed(rows) {
  const medals = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

  const lines = rows.map((user, i) => {
    const medal = medals[i] || `${i + 1}.`;
    const larrified = user.status === 'Larrified' ? ' 😵' : '';
    return `${medal} **${user.username}**${larrified} — **${user.peenar_balance} PEENAR**`;
  });

  return new EmbedBuilder()
    .setTitle("🏆 Larry's PEENAR Empire")
    .setDescription(
      '*Evil Larry surveys his empire of stolen PEENAR…*\n\n' +
      (lines.length > 0 ? lines.join('\n') : '*No one has joined the PEENAR economy yet.*')
    )
    .setColor(COLORS.GOLD)
    .setFooter({ text: 'Evil Larry is always watching. 🐱' })
    .setTimestamp();
}

/**
 * Build error embed
 */
function buildErrorEmbed(message) {
  return new EmbedBuilder()
    .setTitle('🐱 Evil Larry Denies You')
    .setDescription(`> ${message}`)
    .setColor(COLORS.CHAOS_ORANGE)
    .setFooter({ text: 'Evil Larry shakes his head. 🐱' });
}

/**
 * Build Larry Tax embed (daily event)
 */
function buildTaxEmbed(victim) {
  return new EmbedBuilder()
    .setTitle('🐱 Evil Larry Demands His Tax')
    .setDescription(
      `🐱 *Evil Larry demanded a PEENAR tax.*\n\n` +
      `**${victim.username}** has had 1 PEENAR seized by Evil Larry himself.\n\n` +
      `😵 **${victim.username}** is now **LARRIFIED**.`
    )
    .setColor(COLORS.EVIL_RED)
    .setFooter({ text: 'No one escapes the Larry Tax. 🐱' })
    .setTimestamp();
}

module.exports = {
  buildStartEmbed,
  buildAlreadyRegisteredEmbed,
  buildProfileEmbed,
  buildStealSuccessEmbed,
  buildStealFailEmbed,
  buildChamberEmbed,
  buildJamesEmbed,
  buildLeaderboardEmbed,
  buildErrorEmbed,
  buildTaxEmbed,
  IMAGES,
  COLORS,
};
