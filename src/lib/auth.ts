import NextAuth, { type NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import type { Adapter } from "next-auth/adapters"
import * as db from "./db"

const adapter = {
  createUser: async (user: any) => {
    await db.createUser(user)
    return (await db.queryUserByEmail(user.email)) ?? user
  },
  getUser: async (id: string) => await db.queryUserById(id) ?? null,
  getUserByEmail: async (email: string) => await db.queryUserByEmail(email) ?? null,
  getUserByAccount: async ({ provider, providerAccountId }: { provider: string; providerAccountId: string }) =>
    (await db.getUserByAccount(provider, providerAccountId)) ?? null,
  updateUser: async (user: any) => (await db.queryUserById(user.id)) ?? user,
  linkAccount: async (account: any) => { await db.linkAccount(account); return null },
  createSession: async (session: any) => {
    await db.createSession(session)
    return session
  },
  getSessionAndUser: async (sessionToken: string) => {
    const result = await db.getSessionAndUser(sessionToken)
    if (!result) return null
    return { session: result.session as any, user: result.user as any }
  },
  updateSession: async (session: any) => {
    await db.updateSession(session.sessionToken, session.expires)
    return session
  },
  deleteSession: async (sessionToken: string) => { await db.deleteSession(sessionToken); return null },
  createVerificationToken: async (data: any) => {
    await db.createVerificationToken(data.identifier, data.token, data.expires?.toISOString())
    return data
  },
  useVerificationToken: async ({ identifier, token }: { identifier: string; token: string }) =>
    (await db.useVerificationToken(identifier, token)) ?? null,
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
