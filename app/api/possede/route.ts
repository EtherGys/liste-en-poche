
import { getServerSession } from "next-auth/next";
import prisma from "@/utils/prisma";
import {authOptions} from "@/utils/auth";

/**
 * Renvoie toutes les listes possédées par l'utilisateur
 */
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ message: "Non autorisé ou session invalide" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const userId = session.user.id;

    if (!userId) {
        return new Response(JSON.stringify({ message: "ID utilisateur introuvable" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const lists = await prisma.possede.findMany({
        where: {
            id_utilisateur: Number(userId),
        },
    });

    return new Response(JSON.stringify(lists), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ message: "Non autorisé" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { id_liste } = body;

    const created = await prisma.possede.create({
        data: {
            id_utilisateur: Number(userId),
            id_liste,
        },
    });

    return new Response(JSON.stringify(created), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}
