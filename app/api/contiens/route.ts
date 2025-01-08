import {NextRequest} from "next/server";
import prisma from "@/utils/prisma";

// GET ALL
export async function GET(req: NextRequest) {
    try {

        const contien = await prisma.contiens.findMany();

        return new Response(JSON.stringify(contien), { status: 201 })


    } catch (error) {


        return new Response(JSON.stringify(error), { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const {id_liste, id_article, qte} = await req.json();

        const contien = await prisma.contiens.create({
            data: {
                id_liste,
                id_article,
                qte
            }
        });

        return new Response(JSON.stringify(contien), {status: 201})
    } catch (error) {
        return new Response(JSON.stringify(error), {status: 500})
    }
}

export async function PUT(req: NextRequest) {
    try {
        const {id_liste, id_article, qte} = await req.json();

        const contien = await prisma.contiens.update({
            where: {
                id_liste_id_article: {
                    id_liste,
                    id_article
                }
            },
            data: {
                qte
            }
        });

        return new Response(JSON.stringify(contien), {status: 201})
    } catch (error) {
        return new Response(JSON.stringify(error), {status: 500})
    }
}
