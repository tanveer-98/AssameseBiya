const USERS_KEY = 'axaam-jibon.users.v1';
const SESSION_KEY = 'axaam-jibon.session.v1';
const GUEST_SAVED_KEY = 'axaam-jibon.guest-saved.v1';
const PASSWORD_ITERATIONS = 210_000;

function parseStoredJson(key, fallback) {
  const value = localStorage.getItem(key);
  if (value === null) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    throw new Error('Saved account data could not be read. Clear this site’s browser data and try again.');
  }
}

function requireCrypto() {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error('Secure browser storage is unavailable. Use HTTPS or localhost and try again.');
  }
}

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function derivePasswordHash(password, salt) {
  requireCrypto();
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: Uint8Array.from(salt.match(/.{2}/g), (byte) => Number.parseInt(byte, 16)), iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(new Uint8Array(bits));
}

export function loadUserData() {
  const users = parseStoredJson(USERS_KEY, []);
  const guestSaved = parseStoredJson(GUEST_SAVED_KEY, []);
  const sessionEmail = localStorage.getItem(SESSION_KEY);

  if (!Array.isArray(users) || !Array.isArray(guestSaved)) {
    throw new Error('Saved account data is invalid. Clear this site’s browser data and try again.');
  }
  const validUsers = users.every((entry) => entry
    && typeof entry.email === 'string'
    && typeof entry.name === 'string'
    && ['A bride', 'A groom'].includes(entry.lookingFor)
    && Array.isArray(entry.savedProfileIds)
    && entry.savedProfileIds.every(Number.isInteger)
    && /^[a-f\d]{32}$/i.test(entry.passwordSalt)
    && /^[a-f\d]{64}$/i.test(entry.passwordHash));
  if (!validUsers || !guestSaved.every(Number.isInteger)) {
    throw new Error('Saved account data is invalid. Clear this site’s browser data and try again.');
  }

  const user = users.find((entry) => entry.email === sessionEmail) ?? null;
  const saved = user ? user.savedProfileIds : guestSaved;
  return {
    users,
    user,
    saved: Array.isArray(saved) ? saved.filter(Number.isInteger) : [],
  };
}

export function persistUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function persistGuestSaved(saved) {
  localStorage.setItem(GUEST_SAVED_KEY, JSON.stringify(saved));
}

export function clearGuestSaved() {
  localStorage.removeItem(GUEST_SAVED_KEY);
}

export function persistSession(email) {
  localStorage.setItem(SESSION_KEY, email);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function createPasswordCredentials(password) {
  requireCrypto();
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  return { passwordSalt: salt, passwordHash: await derivePasswordHash(password, salt) };
}

export async function verifyPassword(password, user) {
  const candidate = await derivePasswordHash(password, user.passwordSalt);
  if (candidate.length !== user.passwordHash.length) return false;
  let difference = 0;
  for (let index = 0; index < candidate.length; index += 1) {
    difference |= candidate.charCodeAt(index) ^ user.passwordHash.charCodeAt(index);
  }
  return difference === 0;
}
