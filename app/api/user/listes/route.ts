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

        const listsWithArticles = await Promise.all(
            lists.map(async (list) => {
                // Récupère les liens avec les articles associés à la liste
                const liens = await prisma.contiens.findMany({
                    where: {
                        id_liste: list.id_liste,
                    },
                });

                // Récupère les articles et leur quantité associée
                const articles = await Promise.all(
                    liens.map(async (lien) => {
                        const article = await prisma.articles.findUnique({
                            where: {
                                id_article: lien.id_article,
                            },
                        });

                        // Inclure la quantité depuis 'liens'
                        return {
                            ...article,
                            qte: lien.qte,
                        };
                    })
                );

                return { ...list, articles };
            })
        );

        return new Response(JSON.stringify(listsWithArticles), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.log(error);
        return new Response("Failed to get user lists", { status: 500 });
    }

}