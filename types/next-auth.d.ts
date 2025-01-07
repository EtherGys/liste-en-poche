import NextAuth, { DefaultSession } from "next-auth"
import {DefaultJWT} from "@auth/core/jwt";

declare module "next-auth" {

  
    interface Session {
        user: {
            /** The user's postal address. */
            id: string
          } & DefaultSession["user"]
        }
    

   
    interface JWT {
       id: string & DefaultJWT
    }
}