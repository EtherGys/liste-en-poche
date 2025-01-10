"use server"
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import {validateSession} from "@/utils/validateSession";


// Update user 
export async function PUT(req: NextRequest, params: any) {
    
    const { mail, nom, prenom } = await req.json();
    const userId = parseInt(await validateSession(req));
    try {
        
        const user = await prisma.utilisateurs.update({
            
            where: { id_utilisateur: Number(userId) },
            
            
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
    const userId = parseInt(await validateSession(req));
    try {
        const user = await prisma.utilisateurs.findUnique({
            
            where: { id_utilisateur: Number(userId) },
            
            
        });
        
        return new Response(JSON.stringify(user), { status: 200 })
        
        
        
    } catch (error) {
        console.log(error);
        return new Response(`Failed to get user ${userId}`, { status: 500 })
    }
}