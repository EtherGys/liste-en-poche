import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import process from "process";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";



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
                try {
                    const password = credentials?.password as string | Buffer;
                    
                    const user = await prisma.utilisateurs.findFirst({
                        where: {
                            mail: credentials?.email
                        }
                    })
                


                    if (!user) {
                        return null;
                    }

                    if (user != null) {
                        const passwordsMatch =  bcrypt.compare(password.toString(), user.mdp);

                        if (!passwordsMatch) return null;

                        const selectedUser: any = {
                            name: `${user.prenom} ${user.nom} `,
                            email:user.mail ,
                            id: user.id_utilisateur
                        }
                        return selectedUser;

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
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
};