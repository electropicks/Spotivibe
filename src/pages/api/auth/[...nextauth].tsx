import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const scope =
    "user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative";

export default NextAuth({
        providers: [
            SpotifyProvider({
                clientId: process.env.SPOTIFY_CLIENT_ID!,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
                authorization: {
                    url: "https://accounts.spotify.com/authorize",
                    params: {scope},
                },
            }),
        ],
        callbacks: {
            async jwt({token, account, profile}) {
                if (account) {
                    token.id = account.userId;
                    token.name = profile?.name;
                    token.expiresAt = account.expires_at;
                    token.accessToken = account.access_token;
                }
                console.log(token);
                return token;
            },
            async session({ session, token, user }) {
                session.accessToken = token.accessToken;
                session.user = user;

                return session;
            },
        },
    }
);