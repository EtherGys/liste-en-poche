"use server"
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";


// Update user 
export async function PUT(req: NextRequest, params: any) {
    
    const { mail, nom, prenom } = await req.json();
    const id = await params.params.id
    try {
        
        const user = await prisma.utilisateurs.update({
            
            where: { id_utilisateur: Number(id) },
            
            
            data: { mail, nom, prenom },
            
        });
        
        return new Response(JSON.stringify(user), { status: 200 })
        
        
        
    } catch (error) {
        console.log(error);
        return new Response('Failed to create a new user', { status: 500 })
    }
}

// Get user 
export async function GET(req: NextRequest, params: any) {
    const id = await params.params.id
    try {
        const user = await prisma.utilisateurs.findUnique({
            
            where: { id_utilisateur: Number(id) },
            
            
        });
        
        return new Response(JSON.stringify(user), { status: 200 })
        
        
        
    } catch (error) {
        console.log(error);
        return new Response(`Failed to get user ${id}`, { status: 500 })
    }
}