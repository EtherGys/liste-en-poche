import prisma from "@/utils/prisma";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const articles = await prisma.articles.findMany();
        
        return new Response(JSON.stringify(articles), { status: 200 })
        
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
    
    
}