"use server"
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";


// Update user 
export async function PUT(req: NextRequest) {
  
    const { mail, nom, prenom, mdp, id } = await req.json();

    try {
      
        const user = await prisma.utilisateurs.update({

            where: { id_utilisateur: Number(id) },
      
            
            data: { mail, nom, prenom, mdp },
      
          });
          
            return new Response(JSON.stringify(user), { status: 204 })
        
       

    } catch (error) {
        console.log(error);
        return new Response('Failed to create a new user', { status: 500 })
    }
}

// Get user 
export async function GET(req: NextRequest, params: any) {
    try {
      
        const user = await prisma.utilisateurs.findUnique({

            where: { id_utilisateur: Number(params.params.id) },
      
      
          });
          
            return new Response(JSON.stringify(user), { status: 200 })
        
       

    } catch (error) {
        console.log(error);
        return new Response(`Failed to get user ${params.params.id}`, { status: 500 })
    }
}