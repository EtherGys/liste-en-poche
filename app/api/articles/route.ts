import prisma from "@/utils/prisma";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
    try {

        const articles = await prisma.articles.findMany();

        return new Response(JSON.stringify(articles), { status: 201 })


    } catch (error) {


        return new Response(JSON.stringify(error), { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {

        const {nom, acheter} = await req.json();

        const article = await prisma.articles.create({
            data: {
                nom,
                acheter
            }
        });

        return new Response(JSON.stringify(article), {status: 201})
    } catch (error) {
        return new Response(JSON.stringify(error), {status: 500})
    }
}