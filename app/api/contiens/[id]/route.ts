import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/prisma";

export async function GET(req: NextRequest, params: any) {
    const id  = params.params.id;

    try {
        const articles = await prisma.contiens.findMany({
            where: { id_liste: parseInt(id) },
        });

        if (!articles) {
            return NextResponse.json({ error: "Liste non trouvée" }, { status: 404 });
        }

        return NextResponse.json(articles, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, params: any) {
    const id = params.params.id;

    try {
        await prisma.contiens.delete({
            where: { id_liste_id_article: {
                id_liste: parseInt(id),
                id_article: parseInt(id),
                }
                },
        });

        return NextResponse.json({ message: "Liste supprimée" }, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}