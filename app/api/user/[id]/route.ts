"use server"
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";


// Update user 
export async function PUT(req: NextRequest, res: NextResponse) {
  
    const { mail, nom, prenom, mdp, id } = await req.json();

    try {
      
        const user = await prisma.utilisateurs.update({

            where: { Id_Utilisateurs: Number(id) },
      
            
            data: { mail, nom, prenom, mdp },
      
          });
          
            return new Response(JSON.stringify(user), { status: 201 })
        
       

    } catch (error) {
        console.log(error);
        return new Response('Failed to create a new user', { status: 500 })
    }
}