import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from 'jsonwebtoken';

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            email?: string;
            name?: string;
            token?: string;
            image?: string;
        };
    }
}

const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const handler = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            async authorize(credentials) {
                try {
                    if (credentials && 'mode' in credentials && credentials.mode === 'silent') {
                        const response = await fetch(`${apiUrl}/api/v1/auth/social-token`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: credentials.email,
                                firstname: credentials.firstName,
                                lastname: credentials.lastName,
                                role: 'hr',
                                profilePictureURL: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }),
                        });
                        const data = await response.json();
                        if (data.status !== "success") throw new Error("Failed to get refresh token");
                        const decodedToken = jwt.decode(data.data.token) as jwt.JwtPayload;
                        return {
                            id: decodedToken?.id || "",
                            email: decodedToken?.email,
                            name: decodedToken?.names,
                            image: decodedToken?.profilePictureURL || "",
                            token: data.data.token
                        };
                    } else {
                        const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: credentials?.email, password: credentials?.password }),
                        });
                        const data = await response.json();

                        if (data.status !== "success") throw new Error("Invalid credentials");

                        const decodedToken = jwt.decode(data.data.token) as jwt.JwtPayload;
                        return {
                            id: decodedToken?.id || "",
                            email: decodedToken?.email,
                            name: decodedToken?.names,
                            image: decodedToken?.profilePictureURL || "",
                            token: data.data.token
                        };
                    }
                } catch (error) {
                    console.error('An unexpected error happened:', error);
                    throw new Error("Invalid credentials");
                }
            },
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                firstName: { label: "First Name", type: "text", optional: true },
                lastName: { label: "Last Name", type: "text", optional: true }
            }
        })
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
        async session({ session, token }) {
            if (token) {
                if (session.user) {
                    session.user.token = token.accessToken as string;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).token;
            }
            return token;
        }
    }
});

export { handler as GET, handler as POST };
