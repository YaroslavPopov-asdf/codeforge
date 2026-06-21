import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import crypto from "crypto"

const dbPath = path.join(process.cwd(), "data", "codeforge.db")

let db: Database.Database | null = null

function getDb(): Database.Database {
  if (!db) {
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    db = new Database(dbPath)
    db.pragma("journal_mode = WAL")
    initSchema()
  }
  return db
}

function initSchema() {
  db!.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      email_verified TEXT,
      image TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
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
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(provider, provider_account_id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      session_token TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      expires TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires TEXT NOT NULL,
      UNIQUE(identifier, token)
    );

    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, subject_id, task_id)
    );
  `)
}

export function close() {
  if (db) {
    db.close()
    db = null
  }
}

export function queryUserByEmail(email: string) {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email)
}

export function queryUserById(id: string) {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id)
}

export function createUser(user: { id: string; name?: string; email?: string; image?: string }) {
  getDb()
    .prepare(
      "INSERT OR IGNORE INTO users (id, name, email, image) VALUES (?, ?, ?, ?)"
    )
    .run(user.id, user.name ?? null, user.email ?? null, user.image ?? null)
}

export function getProgressByUserId(userId: string) {
  return getDb()
    .prepare("SELECT * FROM progress WHERE user_id = ?")
    .all(userId) as {
    id: string
    user_id: string
    subject_id: string
    task_id: string
    completed: number
  }[]
}

export function upsertProgress(
  userId: string,
  subjectId: string,
  taskId: string,
  completed: boolean
) {
  getDb()
    .prepare(
      `INSERT INTO progress (id, user_id, subject_id, task_id, completed)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(user_id, subject_id, task_id)
       DO UPDATE SET completed = ?, updated_at = datetime('now')`
    )
    .run(
      crypto.randomUUID(),
      userId,
      subjectId,
      taskId,
      completed ? 1 : 0,
      completed ? 1 : 0
    )
}

// Auth adapter functions
export function getAccount(provider: string, providerAccountId: string) {
  return getDb()
    .prepare("SELECT * FROM accounts WHERE provider = ? AND provider_account_id = ?")
    .get(provider, providerAccountId) as any || null
}

export function createAccount(account: {
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
  getDb()
    .prepare(
      `INSERT INTO accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      account.id,
      account.userId,
      account.type,
      account.provider,
      account.providerAccountId,
      account.refresh_token ?? null,
      account.access_token ?? null,
      account.expires_at ?? null,
      account.token_type ?? null,
      account.scope ?? null,
      account.id_token ?? null,
      account.session_state ?? null
    )
}

export function createSession(session: {
  id: string
  sessionToken: string
  userId: string
  expires: string
}) {
  getDb()
    .prepare(
      "INSERT INTO sessions (id, session_token, user_id, expires) VALUES (?, ?, ?, ?)"
    )
    .run(session.id, session.sessionToken, session.userId, session.expires)
}

export function getSessionAndUser(sessionToken: string) {
  const session = getDb()
    .prepare("SELECT * FROM sessions WHERE session_token = ?")
    .get(sessionToken) as any
  if (!session) return null
  const user = queryUserById(session.user_id)
  if (!user) return null
  return { session, user }
}

export function updateSession(sessionToken: string, expires: string) {
  getDb()
    .prepare("UPDATE sessions SET expires = ? WHERE session_token = ?")
    .run(expires, sessionToken)
}

export function deleteSession(sessionToken: string) {
  getDb()
    .prepare("DELETE FROM sessions WHERE session_token = ?")
    .run(sessionToken)
}

export function linkAccount(account: any) {
  createAccount(account)
}

export function getUserByAccount(provider: string, providerAccountId: string) {
  const account = getAccount(provider, providerAccountId) as any
  if (!account) return null
  return queryUserById(account.user_id)
}

export function createVerificationToken(identifier: string, token: string, expires: string) {
  getDb()
    .prepare(
      "INSERT INTO verification_tokens (identifier, token, expires) VALUES (?, ?, ?)"
    )
    .run(identifier, token, expires)
}

export function useVerificationToken(identifier: string, token: string) {
  const vt = getDb()
    .prepare(
      "SELECT * FROM verification_tokens WHERE identifier = ? AND token = ?"
    )
    .get(identifier, token) as any
  if (vt) {
    getDb()
      .prepare("DELETE FROM verification_tokens WHERE identifier = ? AND token = ?")
      .run(identifier, token)
  }
  return vt
}
