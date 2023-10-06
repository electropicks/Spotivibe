import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";
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
            async jwt({ token, account, user }) {
                // Initial sign in
                if (account && user) {
                        token.accessToken = account.access_token!;
                        token.accessTokenExpires = Date.now() + account.expires_at! * 1000;
                        token.id = user.id;
                        token.name = user.name!;
                        token.email = user.email!;
                        token.refreshToken = account.refresh_token!;
                }
                // Return previous token if the access token has not expired yet
                if (Date.now() < token.accessTokenExpires) {
                    return token;
                } else {
                    return refreshAccessToken(token);
                }
            },
            async session({ session, token}) {
                session.accessToken = token.accessToken;
                session.accessTokenExpires = token.accessTokenExpires;
                session.user!.name = token.name;
                session.user!.email = token.email;
                return session;
            },
        },
    }
);


async function refreshAccessToken(token: JWT) {
    try {
        const response = await axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const { access_token: newAccessToken, expires_in } = response.data;

        // Calculate the new expiration time
        const accessTokenExpires = Date.now() + expires_in * 1000;

        // Update the token with the new values
        token.accessToken = newAccessToken;
        token.accessTokenExpires = accessTokenExpires;

        return token;
    } catch (error) {
        console.error("Error refreshing access token:", error);
        throw new Error("Failed to refresh access token");
    }
}