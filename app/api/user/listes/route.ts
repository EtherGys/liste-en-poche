import {getServerSession} from "next-auth/next";
import {authOptions} from "@/utils/auth";
import prisma from "@/utils/prisma";
import {NextRequest} from "next/server";

/**
 * Renvoie toutes les listes possédées par l'utilisateur
 */
export async function GET(req: NextRequest) {
    const userId = parseInt(req.headers.get("userId")!);

    const user_lists = await prisma.possede.findMany({
        where: {
            id_utilisateur: userId,
        },
    });

    const lists = await prisma.listes.findMany({
        where: {
            id_liste: {
                in: user_lists.map((l) => l.id_liste),
            },
        },
    });

    return new Response(JSON.stringify(lists), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}