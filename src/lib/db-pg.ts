import { Pool } from "pg"
import crypto from "crypto"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      email_verified TIMESTAMP,
      image TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      UNIQUE(provider, provider_account_id)
    );
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      session_token TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TIMESTAMP NOT NULL
    );
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires TIMESTAMP NOT NULL,
      UNIQUE(identifier, token)
    );
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subject_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, subject_id, task_id)
    );
  `)
}

const initPromise = initSchema()

function row(row: any) {
  return row ?? null
}

export async function queryUserByEmail(email: string) {
  await initPromise
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email])
  return row(rows[0])
}

export async function queryUserById(id: string) {
  await initPromise
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id])
  return row(rows[0])
}

export async function createUser(user: { id: string; name?: string; email?: string; image?: string }) {
  await initPromise
  await pool.query(
    "INSERT INTO users (id, name, email, image) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
    [user.id, user.name ?? null, user.email ?? null, user.image ?? null]
  )
}

export async function getProgressByUserId(userId: string) {
  await initPromise
  const { rows } = await pool.query("SELECT * FROM progress WHERE user_id = $1", [userId])
  return rows as {
    id: string
    user_id: string
    subject_id: string
    task_id: string
    completed: number
  }[]
}

export async function upsertProgress(
  userId: string,
  subjectId: string,
  taskId: string,
  completed: boolean
) {
  await initPromise
  await pool.query(
    `INSERT INTO progress (id, user_id, subject_id, task_id, completed)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, subject_id, task_id)
     DO UPDATE SET completed = $5, updated_at = NOW()`,
    [crypto.randomUUID(), userId, subjectId, taskId, completed ? 1 : 0]
  )
}

export async function getAccount(provider: string, providerAccountId: string) {
  await initPromise
  const { rows } = await pool.query(
    "SELECT * FROM accounts WHERE provider = $1 AND provider_account_id = $2",
    [provider, providerAccountId]
  )
  return row(rows[0])
}

export async function createAccount(account: {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
}) {
  await initPromise
  await pool.query(
    `INSERT INTO accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      account.id, account.userId, account.type, account.provider,
      account.providerAccountId, account.refresh_token ?? null,
      account.access_token ?? null, account.expires_at ?? null,
      account.token_type ?? null, account.scope ?? null,
      account.id_token ?? null, account.session_state ?? null,
    ]
  )
}

export async function createSession(session: {
  id: string
  sessionToken: string
  userId: string
  expires: string
}) {
  await initPromise
  await pool.query(
    "INSERT INTO sessions (id, session_token, user_id, expires) VALUES ($1, $2, $3, $4)",
    [session.id, session.sessionToken, session.userId, session.expires]
  )
}

export async function getSessionAndUser(sessionToken: string) {
  await initPromise
  const { rows } = await pool.query(
    "SELECT * FROM sessions WHERE session_token = $1",
    [sessionToken]
  )
  const session = rows[0]
  if (!session) return null
  const { rows: userRows } = await pool.query("SELECT * FROM users WHERE id = $1", [session.user_id])
  return { session, user: userRows[0] }
}

export async function updateSession(sessionToken: string, expires: string) {
  await initPromise
  await pool.query("UPDATE sessions SET expires = $1 WHERE session_token = $2", [expires, sessionToken])
}

export async function deleteSession(sessionToken: string) {
  await initPromise
  await pool.query("DELETE FROM sessions WHERE session_token = $1", [sessionToken])
}

export async function linkAccount(account: any) {
  await createAccount(account)
}

export async function getUserByAccount(provider: string, providerAccountId: string) {
  const account = await getAccount(provider, providerAccountId) as any
  if (!account) return null
  return queryUserById(account.user_id)
}

export async function createVerificationToken(identifier: string, token: string, expires: string) {
  await initPromise
  await pool.query(
    "INSERT INTO verification_tokens (identifier, token, expires) VALUES ($1, $2, $3)",
    [identifier, token, expires]
  )
}

export async function useVerificationToken(identifier: string, token: string) {
  await initPromise
  const { rows } = await pool.query(
    "SELECT * FROM verification_tokens WHERE identifier = $1 AND token = $2",
    [identifier, token]
  )
  const vt = rows[0]
  if (vt) {
    await pool.query(
      "DELETE FROM verification_tokens WHERE identifier = $1 AND token = $2",
      [identifier, token]
    )
  }
  return vt ?? null
}
