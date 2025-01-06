import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import process from "process";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions =
{
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                // const { email, password } = credentials;                
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/user/login`,
                        {
                            method: "POST",
                            body: JSON.stringify(credentials),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const user = await res.json();
                    
                    if (res.ok && user) {
                        return user;
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.log("Error: ", error);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return { ...token, id: user.id };
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    email: token.email,
                    id: token.id
                },
                error: ""
            }
        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: 'jwt'
    },
    events: {
        async createUser(message) {
            const userId = message.user.id;
            const email = message.user.email;
            const name = message.user.name;
            
            if (!userId || !email) {
                return
            }
            
            
          
            
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
};