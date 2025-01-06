import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/prisma";

export async function GET(req: NextRequest, params: any) {
    const id  = params.params.id;

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

export async function PUT(req: NextRequest, params: any) {
    const id = params.params.id;

    try {
        const { nom, modificateur } = await req.json();

        const updatedliste = await prisma.listes.update({
            where: { id_liste: parseInt(id) },
            data: { nom, modificateur },
        });

        return NextResponse.json(updatedliste, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, params: any) {
    const id = params.params.id;

    try {
        await prisma.listes.delete({
            where: { id_liste: parseInt(id) },
        });

        return NextResponse.json({ message: "Liste supprimée" }, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}