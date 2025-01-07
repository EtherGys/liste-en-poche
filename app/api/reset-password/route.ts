"use server";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";

// Update user password
export async function PUT(req: NextRequest) {

    const { email, newPassword } = await req.json();

    try {
        const user = await prisma.utilisateurs.findFirst({
            where: { mail: email },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "Utilisateur non trouvé." }),
                { status: 404 }
            );
        }

        // Crypte
        const hashedPassword = bcrypt.hashSync(newPassword as string, 10);
        const updatedUser = await prisma.utilisateurs.update({
            where: { id_utilisateur: user.id_utilisateur },
            data: { mdp: hashedPassword },
        });

        return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Erreur serveur. Veuillez réessayer plus tard." }),
            { status: 500 }
        );
    }
}