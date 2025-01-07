import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/prisma";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/utils/auth";

/**
 * Récupère une liste depuis son ID
 */
export async function GET(req: NextRequest, params: any) {
    const userId = parseInt(req.headers.get("userId")!);
    const id  = params.params.id;

    const canView = await prisma.possede.findFirst({
        where: {
            id_utilisateur: userId,
            id_liste: parseInt(id),
        },
    });

    if (!canView) {
        return new Response(JSON.stringify({ message: "Non autorisé" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    } else {
        try {
            const liste = await prisma.listes.findUnique({
                where: { id_liste: parseInt(id) },
            });

            if (!liste) {
                return NextResponse.json({ error: "Liste non trouvée" }, { status: 404 });
            }

            return NextResponse.json(liste, { status: 200 });
        } catch (error:any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

export async function PUT(req: NextRequest, params: any) {
    const userId = parseInt(req.headers.get("userId")!);
    const id  = params.params.id;

    const canView = await prisma.possede.findFirst({
        where: {
            id_utilisateur: userId,
            id_liste: parseInt(id),
        },
    });

    if (!canView) {
        return new Response(JSON.stringify({ message: "Non autorisé" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const { nom, articles } = await req.json();

        const updatedliste = await prisma.listes.update({
            where: { id_liste: parseInt(id) },
            data: {
                nom,
                modificateur: userId
            },
        });

        // On supprime les articles de la liste
        await prisma.contiens.deleteMany({
            where: {
                id_liste: parseInt(id),
            },
        });

        // On ajoute les articles à la liste
        for (const article of articles) {
            await prisma.contiens.create({
                data: {
                    id_liste: parseInt(id),
                    id_article: article.id_article,
                    qte: article.qte,
                },
            });
        }

        return NextResponse.json({updatedliste, articles}, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, params: any) {
    const userId = parseInt(req.headers.get("userId")!);

    const id = params.params.id;

    try {

        const liste = await prisma.listes.findUnique({
            where: { id_liste: parseInt(id) },
        });

        if (!liste) {
            return NextResponse.json({ error: "Liste non trouvée" }, { status: 404 });
        }

        if (liste.createur !== userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        await prisma.listes.delete({
            where: { id_liste: parseInt(id) },
        });

        return NextResponse.json({ message: "Liste supprimée" }, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}