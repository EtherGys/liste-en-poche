import {getServerSession} from "next-auth/next";
import {authOptions} from "@/utils/auth";
import prisma from "@/utils/prisma";
import {NextRequest} from "next/server";
import {validateSession} from "@/utils/validateSession";

/**
 * Renvoie toutes les listes possédées par l'utilisateur
 */
export async function GET(req: NextRequest) {
    try {
        const userId = parseInt(await validateSession(req));

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
    } catch (error) {
        console.log(error);
        return new Response("Failed to get user lists", { status: 500 });
    }

}