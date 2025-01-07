import {NextRequest} from "next/server";
import prisma from "@/utils/prisma";
import {authOptions} from "@/utils/auth";
import {getServerSession} from "next-auth/next";

export async function GET(req: NextRequest, params: any) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ message: "Non autorisé" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // On récupère l'email de l'utilisateur connecté
    const userEmail = session.user.email;

    // On récupère l'invitation
    const liste = await prisma.listes.findFirst(
        {
            where: {
                uuid: params.id,
            },
        }
    )

    const invitation = await prisma.invitations.findFirst({
        where: {
            fk_liste: liste!.id_liste,
        },
    });

    // On vérifie que l'email est celui spécifié dans l'invitation
    if (invitation?.email !== userEmail) {
        return new Response(JSON.stringify({message: "Non autorisé"}), {
            status: 401,
            headers: {"Content-Type": "application/json"},
        });
    }

    // On ajoute l'utilisateur à la la liste
     await prisma.possede.create({
        data: {
            id_utilisateur: parseInt(session.user.id),
            id_liste: parseInt(params.id),
        },
    });

    // On supprime l'invitation
    await prisma.invitations.delete({
        where: {
            id_invitation: invitation?.id_invitation,
        },
    });

    return new Response(JSON.stringify({message: "Liste rejointe"}), {
        status: 200,
        headers: {"Content-Type": "application/json"},
    });
}