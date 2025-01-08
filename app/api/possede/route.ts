
import { getServerSession } from "next-auth/next";
import prisma from "@/utils/prisma";
import {authOptions} from "@/utils/auth";
import {validateSession} from "@/utils/validateSession";

/**
 * Supprime le lien utilisateur/liste
 * @param req
 * @constructor
 */
export async function DELETE(req: Request) {
    try {
        const userId = parseInt(await validateSession(req));
        const body = await req.json();
        const { id_liste, id_invite} = body;

        const liste = await prisma.listes.findFirst({
            where: {
                id_liste,
            },
        });

        if (!liste) {
            return new Response(JSON.stringify({ message: "Liste introuvable" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (liste.createur !== userId) {
            return new Response(JSON.stringify({ message: "Non autorisé" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            const deleted = await prisma.possede.deleteMany({
                where: {
                    id_utilisateur: id_invite,
                    id_liste,
                },
            });

            return new Response(JSON.stringify(deleted), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        console.log(error);
        return new Response("Failed to delete user from list", { status: 500 });
    }

}

export async function POST(req: Request) {
    try {
        const userId = parseInt(await validateSession(req));
        const body = await req.json();
        const { id_liste, email} = body;

        const liste = await prisma.listes.findFirst({
            where: {
                id_liste,
            },
        });

        if (!liste) {
            return new Response(JSON.stringify({ message: "Liste introuvable" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (liste.createur !== userId) {
            return new Response(JSON.stringify({ message: "Non autorisé" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            await prisma.invitations.create({
                    data: {
                        email,
                        fk_liste: id_liste
                    },
                }
            );

            const lien = "http://localhost:3000/api/listes/join/"+liste.uuid;


            return new Response(JSON.stringify(lien), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        console.log(error);
        return new Response("Failed to invite user to list", { status: 500 });
    }

}