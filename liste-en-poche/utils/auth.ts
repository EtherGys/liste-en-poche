import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import process from "process";
import { PrismaClient } from "@prisma/client";

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
                    const password = credentials?.password as string | Buffer;
                    await prisma();
                    const user = await User.findOne({ user_email: credentials?.email }).exec();
                 
                        const passwordsMatch = await bcrypt.compare(password, user.password);

                        if (!passwordsMatch) return null;

                        const selectedUser: any = {
                            name: user.subscriber_firstname,
                            email: user.subscriber_email,
                        }
                        return selectedUser;
                    
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
        

            await connectToDB();
           
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};