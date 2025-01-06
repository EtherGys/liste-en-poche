import prisma from "@/utils/prisma";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
    try {

        const listes = await prisma.listes.findMany();

        return new Response(JSON.stringify(listes), { status: 201 })


    } catch (error) {


        return new Response(JSON.stringify(error), { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const {nom, createur} = await req.json();

        const liste = await prisma.listes.create({
            data: {
                nom,
                createur
            }
        });

        return new Response(JSON.stringify(liste), {status: 201})
    } catch (error) {
        return new Response(JSON.stringify(error), {status: 500})
    }
}