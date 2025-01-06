"use server"
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";


// Create a new user 
export async function POST(req: NextRequest, res: NextResponse) {
    const { mail, nom, prenom, mdp } = await req.json();

    try {
      
   
            const hashedPassword = await bcrypt.hashSync(mdp, 10);
            const newUser = await prisma.utilisateurs.create({

                data: { mail, nom, prenom, mdp },
          
              });

          

          
            return new Response(JSON.stringify(newUser), { status: 201 })
        
       

    } catch (error) {
        console.log(error);
        return new Response('Failed to create a new user', { status: 500 })
    }
}