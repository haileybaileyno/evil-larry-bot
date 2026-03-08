// src/database/db.js
// Supabase database layer for Evil Larry Cat Bot

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ─── Evil Level Rank System ───────────────────────────────────────────────────
const EVIL_RANKS = [
  { level: 0,  rank: 'Innocent Fool 😇' },
  { level: 1,  rank: 'Larry Follower 🐱' },
  { level: 3,  rank: 'Junior Menace 😈' },
  { level: 5,  rank: 'Chaos Agent 🔥' },
  { level: 10, rank: 'True Evil 💀' },
  { level: 20, rank: 'Disciple of Larry 👑' },
];

function getEvilRank(evilLevel) {
  let rank = EVIL_RANKS[0];
  for (const r of EVIL_RANKS) {
    if (evilLevel >= r.level) rank = r;
  }
  return rank.rank;
}

// ─── User Functions ───────────────────────────────────────────────────────────

async function getUser(userId) {
  const { data, error } = await supabase
    .from('elc_users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  return data || null;
}

async function createUser(userId, username, avatarUrl) {
  const { data, error } = await supabase
    .from('elc_users')
    .insert({
      user_id: userId,
      username,
      avatar_url: avatarUrl,
      peenar_balance: 1,
      stolen_peenar: 0,
      status: 'Normal',
      protection_active: false,
      evil_level: 0,
      evil_points: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function upsertUser(userId, username, avatarUrl) {
  // Update avatar/username if user already exists, or create them
  const existing = await getUser(userId);
  if (existing) {
    await supabase
      .from('elc_users')
      .update({ username, avatar_url: avatarUrl })
      .eq('user_id', userId);
    return { user: existing, isNew: false };
  }
  const user = await createUser(userId, username, avatarUrl);
  return { user, isNew: true };
}

async function updateUser(userId, updates) {
  const { data, error } = await supabase
    .from('elc_users')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Protection Functions ─────────────────────────────────────────────────────

async function setProtection(userId, active, durationMs = 3600000) {
  const expiresAt = active ? new Date(Date.now() + durationMs).toISOString() : null;
  return updateUser(userId, {
    protection_active: active,
    protection_expires_at: expiresAt,
  });
}

async function checkAndExpireProtection(user) {
  if (user.protection_active && user.protection_expires_at) {
    const now = new Date();
    const expiry = new Date(user.protection_expires_at);
    if (now > expiry) {
      await updateUser(user.user_id, {
        protection_active: false,
        protection_expires_at: null,
      });
      return false;
    }
    return true;
  }
  return false;
}

// ─── Steal Functions ──────────────────────────────────────────────────────────

async function canSteal(attackerId) {
  const user = await getUser(attackerId);
  if (!user) return { canSteal: false, reason: 'not_registered' };

  if (user.last_steal_time) {
    const cooldownMs = 30 * 60 * 1000; // 30 minutes
    const timeSince = Date.now() - new Date(user.last_steal_time).getTime();
    if (timeSince < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - timeSince) / 60000);
      return { canSteal: false, reason: 'cooldown', remaining };
    }
  }
  return { canSteal: true };
}

async function executeSteal(attackerId, victimId) {
  const success = Math.random() < 0.5;

  // Update attacker cooldown
  await updateUser(attackerId, { last_steal_time: new Date().toISOString() });

  // Log the steal
  await supabase.from('elc_steal_log').insert({
    attacker_id: attackerId,
    victim_id: victimId,
    success,
  });

  if (success) {
    // Attacker gains 1 stolen PEENAR, victim loses 1
    const attacker = await getUser(attackerId);
    const victim = await getUser(victimId);

    await updateUser(attackerId, {
      peenar_balance: attacker.peenar_balance + 1,
      stolen_peenar: attacker.stolen_peenar + 1,
    });
    await updateUser(victimId, {
      peenar_balance: Math.max(0, victim.peenar_balance - 1),
      status: 'Larrified',
    });
  } else {
    // Failed — victim steals 1 from attacker instead
    const attacker = await getUser(attackerId);
    const victim = await getUser(victimId);

    await updateUser(victimId, {
      peenar_balance: victim.peenar_balance + 1,
      stolen_peenar: victim.stolen_peenar + 1,
    });
    await updateUser(attackerId, {
      peenar_balance: Math.max(0, attacker.peenar_balance - 1),
      status: 'Larrified',
    });
  }

  return success;
}

// ─── Chamber Functions ────────────────────────────────────────────────────────

async function destroyPeenar(destroyerUserId, originalOwnerId) {
  // Decrement destroyer's stolen_peenar count and total peenar
  const destroyer = await getUser(destroyerUserId);
  if (destroyer.stolen_peenar < 1) {
    throw new Error('NO_STOLEN_PEENAR');
  }

  // Update destroyer
  const newEvilPoints = destroyer.evil_points + 1;
  const newEvilLevel = calculateEvilLevel(newEvilPoints);

  await updateUser(destroyerUserId, {
    peenar_balance: Math.max(0, destroyer.peenar_balance - 1),
    stolen_peenar: destroyer.stolen_peenar - 1,
    evil_points: newEvilPoints,
    evil_level: newEvilLevel,
  });

  // Log the destruction
  await supabase.from('elc_destroyed_peenar').insert({
    destroyed_by_user_id: destroyerUserId,
    original_owner_id: originalOwnerId,
  });

  return {
    newEvilLevel,
    newEvilPoints,
    evilRank: getEvilRank(newEvilLevel),
  };
}

function calculateEvilLevel(evilPoints) {
  if (evilPoints >= 20) return 20;
  if (evilPoints >= 10) return 10;
  if (evilPoints >= 5) return 5;
  if (evilPoints >= 3) return 3;
  if (evilPoints >= 1) return 1;
  return 0;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('elc_users')
    .select('username, peenar_balance, evil_level, status')
    .order('peenar_balance', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// ─── Random Tax (Evil Larry's daily event) ────────────────────────────────────

async function randomLarryTax() {
  // Get all users with at least 1 PEENAR
  const { data: users, error } = await supabase
    .from('elc_users')
    .select('*')
    .gte('peenar_balance', 1);

  if (error || !users || users.length === 0) return null;

  const victim = users[Math.floor(Math.random() * users.length)];
  await updateUser(victim.user_id, {
    peenar_balance: victim.peenar_balance - 1,
    status: 'Larrified',
  });

  return victim;
}

// ─── All Users (for daily tax) ────────────────────────────────────────────────

async function getAllUsers() {
  const { data, error } = await supabase
    .from('elc_users')
    .select('*');
  if (error) throw error;
  return data || [];
}

module.exports = {
  supabase,
  getUser,
  createUser,
  upsertUser,
  updateUser,
  setProtection,
  checkAndExpireProtection,
  canSteal,
  executeSteal,
  destroyPeenar,
  getLeaderboard,
  randomLarryTax,
  getAllUsers,
  getEvilRank,
  calculateEvilLevel,
};
