import NextAuth, { type NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import type { Adapter } from "next-auth/adapters"
import * as db from "./db"

const adapter = {
  createUser: (user: any) => {
    db.createUser(user)
    return db.queryUserByEmail(user.email) ?? user
  },
  getUser: (id: string) => db.queryUserById(id) ?? null,
  getUserByEmail: (email: string) => db.queryUserByEmail(email) ?? null,
  getUserByAccount: ({ provider, providerAccountId }: { provider: string; providerAccountId: string }) =>
    db.getUserByAccount(provider, providerAccountId) ?? null,
  updateUser: (user: any) => db.queryUserById(user.id) ?? user,
  linkAccount: (account: any) => { db.linkAccount(account); return null },
  createSession: (session: any) => {
    db.createSession(session)
    return session
  },
  getSessionAndUser: (sessionToken: string) => {
    const result = db.getSessionAndUser(sessionToken)
    if (!result) return null
    return { session: result.session as any, user: result.user as any }
  },
  updateSession: (session: any) => {
    db.updateSession(session.sessionToken, session.expires)
    return session
  },
  deleteSession: (sessionToken: string) => { db.deleteSession(sessionToken); return null },
  createVerificationToken: (data: any) => {
    db.createVerificationToken(data.identifier, data.token, data.expires?.toISOString())
    return data
  },
  useVerificationToken: ({ identifier, token }: { identifier: string; token: string }) =>
    db.useVerificationToken(identifier, token) ?? null,
} as Adapter

export const config: NextAuthConfig = {
  adapter,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    session({ session, user }) {
      if (user?.id) {
        session.user.id = user.id
      }
      return session
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)
