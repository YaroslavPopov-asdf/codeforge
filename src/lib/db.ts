import crypto from "crypto"
import path from "path"
import fs from "fs"
import type Database from "better-sqlite3"

type SqliteDb = Database.Database

const usePg = !!process.env.DATABASE_URL

let pg: typeof import("./db-pg") | null = null
let sqliteDb: SqliteDb | null = null

async function pgMod(): Promise<typeof import("./db-pg")> {
  if (!pg) pg = await import("./db-pg")
  return pg
}

function getSqliteDb(): SqliteDb {
  if (!sqliteDb) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const BetterSqlite3 = require("better-sqlite3") as typeof import("better-sqlite3")
    const dbPath = path.join(process.cwd(), "data", "codeforge.db")
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    sqliteDb = new BetterSqlite3(dbPath)
    sqliteDb.pragma("journal_mode = WAL")
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, email_verified TEXT, image TEXT, created_at TEXT DEFAULT (datetime('now')));
      CREATE TABLE IF NOT EXISTS accounts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, type TEXT NOT NULL, provider TEXT NOT NULL, provider_account_id TEXT NOT NULL, refresh_token TEXT, access_token TEXT, expires_at INTEGER, token_type TEXT, scope TEXT, id_token TEXT, session_state TEXT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, UNIQUE(provider, provider_account_id));
      CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, session_token TEXT UNIQUE NOT NULL, user_id TEXT NOT NULL, expires TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
      CREATE TABLE IF NOT EXISTS verification_tokens (identifier TEXT NOT NULL, token TEXT UNIQUE NOT NULL, expires TEXT NOT NULL, UNIQUE(identifier, token));
      CREATE TABLE IF NOT EXISTS progress (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, subject_id TEXT NOT NULL, task_id TEXT NOT NULL, completed INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, UNIQUE(user_id, subject_id, task_id));
    `)
  }
  return sqliteDb
}

function row<T>(r: T | undefined): T | null {
  return r ?? null
}

export async function queryUserByEmail(email: string) {
  if (usePg) return (await pgMod()).queryUserByEmail(email)
  return row(getSqliteDb().prepare("SELECT * FROM users WHERE email = ?").get(email))
}

export async function queryUserById(id: string) {
  if (usePg) return (await pgMod()).queryUserById(id)
  return row(getSqliteDb().prepare("SELECT * FROM users WHERE id = ?").get(id))
}

export async function createUser(user: { id: string; name?: string; email?: string; image?: string }) {
  if (usePg) return (await pgMod()).createUser(user)
  getSqliteDb()
    .prepare("INSERT OR IGNORE INTO users (id, name, email, image) VALUES (?, ?, ?, ?)")
    .run(user.id, user.name ?? null, user.email ?? null, user.image ?? null)
}

export async function getProgressByUserId(userId: string) {
  if (usePg) return (await pgMod()).getProgressByUserId(userId)
  return getSqliteDb()
    .prepare("SELECT * FROM progress WHERE user_id = ?")
    .all(userId) as any
}

export async function upsertProgress(userId: string, subjectId: string, taskId: string, completed: boolean) {
  if (usePg) return (await pgMod()).upsertProgress(userId, subjectId, taskId, completed)
  getSqliteDb()
    .prepare(`INSERT INTO progress (id, user_id, subject_id, task_id, completed) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, subject_id, task_id) DO UPDATE SET completed = ?, updated_at = datetime('now')`)
    .run(crypto.randomUUID(), userId, subjectId, taskId, completed ? 1 : 0, completed ? 1 : 0)
}

export async function getAccount(provider: string, providerAccountId: string) {
  if (usePg) return (await pgMod()).getAccount(provider, providerAccountId)
  return row(getSqliteDb().prepare("SELECT * FROM accounts WHERE provider = ? AND provider_account_id = ?").get(provider, providerAccountId))
}

export async function createAccount(account: {
  id?: string; userId: string; type: string; provider: string; providerAccountId: string
  refresh_token?: string; access_token?: string; expires_at?: number
  token_type?: string; scope?: string; id_token?: string; session_state?: string
}) {
  if (usePg) return (await pgMod()).createAccount(account)
  const id = account.id ?? crypto.randomUUID()
  getSqliteDb()
    .prepare(`INSERT INTO accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, account.userId, account.type, account.provider, account.providerAccountId,
      account.refresh_token ?? null, account.access_token ?? null, account.expires_at ?? null,
      account.token_type ?? null, account.scope ?? null, account.id_token ?? null, account.session_state ?? null)
}

export async function createSession(session: { id: string; sessionToken: string; userId: string; expires: string }) {
  if (usePg) return (await pgMod()).createSession(session)
  getSqliteDb().prepare("INSERT INTO sessions (id, session_token, user_id, expires) VALUES (?, ?, ?, ?)").run(session.id, session.sessionToken, session.userId, session.expires)
}

export async function getSessionAndUser(sessionToken: string) {
  if (usePg) return (await pgMod()).getSessionAndUser(sessionToken)
  const session: any = getSqliteDb().prepare("SELECT * FROM sessions WHERE session_token = ?").get(sessionToken)
  if (!session) return null
  const user = await queryUserById(session.user_id)
  if (!user) return null
  return { session, user }
}

export async function updateSession(sessionToken: string, expires: string) {
  if (usePg) return (await pgMod()).updateSession(sessionToken, expires)
  getSqliteDb().prepare("UPDATE sessions SET expires = ? WHERE session_token = ?").run(expires, sessionToken)
}

export async function deleteSession(sessionToken: string) {
  if (usePg) return (await pgMod()).deleteSession(sessionToken)
  getSqliteDb().prepare("DELETE FROM sessions WHERE session_token = ?").run(sessionToken)
}

export async function linkAccount(account: any) {
  if (usePg) return (await pgMod()).linkAccount(account)
  await createAccount(account)
}

export async function getUserByAccount(provider: string, providerAccountId: string) {
  if (usePg) return (await pgMod()).getUserByAccount(provider, providerAccountId)
  const account: any = await getAccount(provider, providerAccountId)
  if (!account) return null
  return queryUserById(account.user_id)
}

export async function createVerificationToken(identifier: string, token: string, expires: string) {
  if (usePg) return (await pgMod()).createVerificationToken(identifier, token, expires)
  getSqliteDb().prepare("INSERT INTO verification_tokens (identifier, token, expires) VALUES (?, ?, ?)").run(identifier, token, expires)
}

export async function useVerificationToken(identifier: string, token: string) {
  if (usePg) return (await pgMod()).useVerificationToken(identifier, token)
  const vt: any = getSqliteDb().prepare("SELECT * FROM verification_tokens WHERE identifier = ? AND token = ?").get(identifier, token)
  if (vt) getSqliteDb().prepare("DELETE FROM verification_tokens WHERE identifier = ? AND token = ?").run(identifier, token)
  return vt ?? null
}

export function close() {
  if (sqliteDb) { sqliteDb.close(); sqliteDb = null }
}
