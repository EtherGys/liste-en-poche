import prisma from "@/utils/prisma";
import {NextRequest} from "next/server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/utils/auth";
import {validateSession} from "@/utils/validateSession";

/**
 * Récupère toutes les listes publiques
 */
export async function GET() {
    try {
        const listes = await prisma.listes.findMany(
            {
                where: {
                    publique: 1
                }
            }
        );

        console.log(listes);
        return new Response(JSON.stringify(listes), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 });
    }
}

/**
 * Crée une nouvelle liste
 */
export async function POST(req: NextRequest) {
    try {
        const userId = parseInt(await validateSession(req));
        const {nom, publique, articles} = await req.json();
        console.log(nom, publique, articles);

        const liste = await prisma.listes.create({
            data: {
                nom,
                createur: userId,
                publique : publique ? 1 : 0
            }
        });

        console.log("Liste créée");
        for (const article of articles) {
            console.log(article);
            await prisma.articles.update({
                where: {
                    id_article: article.id_article,
                },
                data: {
                    nom: article.nom,
                }
            });
        }

        console.log("Articles mis à jour");
        // On ajoute les articles à la liste
        for (const article of articles) {
            await prisma.contiens.create({
                data: {
                    id_liste: liste.id_liste,
                    id_article: article.id_article,
                    qte: article.qte
                }
            });
        }

        // Création lien liste/ user
        await prisma.possede.create({
            data: {
                id_utilisateur: userId,
                id_liste: liste.id_liste
            }
        });

        console.log("Articles ajoutés à la liste");
        return new Response(JSON.stringify(liste), {status: 201})
    } catch (error) {
        return new Response(JSON.stringify(error), {status: 500})
    }
}