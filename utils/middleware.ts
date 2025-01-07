import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import {authOptions} from "@/utils/auth";

export async function middleware(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
        return new NextResponse(
            JSON.stringify({ message: "Non autorisé" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    // Injecte l'ID utilisateur directement dans les headers de la requête
    req.headers.set("userId", session.user.id);

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/(?!auth|register)(.*)"],
};
