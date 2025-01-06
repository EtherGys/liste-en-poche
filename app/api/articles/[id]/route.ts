import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/prisma";

export async function GET(req: NextRequest, params: any) {
    const id  = params.params.id;

    try {
        const article = await prisma.articles.findUnique({
            where: { id_article: parseInt(id) },
        });

        if (!article) {
            return NextResponse.json({ error: "Article non trouvé" }, { status: 404 });
        }

        return NextResponse.json(article, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, params: any) {
    const id = params.params.id;

    try {
        const { nom, acheter } = await req.json();

        const updatedArticle = await prisma.articles.update({
            where: { id_article: parseInt(id) },
            data: { nom, acheter },
        });

        return NextResponse.json(updatedArticle, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, params: any) {
    const id = params.params.id;

    try {
        await prisma.articles.delete({
            where: { id_article: parseInt(id) },
        });

        return NextResponse.json({ message: "Article supprimé" }, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}