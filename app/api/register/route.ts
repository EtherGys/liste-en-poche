"use server"
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";


// Create a new user 
export async function POST(req: NextRequest) {
    const { mail, nom, prenom, password} = await req.json();
    
    try {
        const mdp =  bcrypt.hashSync(password as string, 10);
        
        const newUser = await prisma.utilisateurs.create({
            data: { mail, nom, prenom, mdp },
        });
        
        return new Response(JSON.stringify(newUser), { status: 201 })
    } catch (error) {
      
        return new Response(JSON.stringify(error), { status: 500 })
    }
}