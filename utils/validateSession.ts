import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function validateSession(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        throw new Error("Non autorisé");
    }

    return session.user.id;
}
