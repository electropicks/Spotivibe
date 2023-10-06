import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import User from "next-auth/types/user";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        expires: number,
        accessTokenExpires: number,
        accessToken: string
            & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends Record<string, unknown>, DefaultJWT {
        accessToken: string,
        id: string,
        name: string,
        accessTokenExpires: number,
        refreshToken?: string,
        user: User
    }
}