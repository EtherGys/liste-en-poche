'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserLists from "@/components/UserLists";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [listes, setListes] = useState<any[]>([]);

    const [user, setUser] = useState({
        email: "",
        firstname: "",
        lastname: "",
    });

    const fetchListes = async (id: any) => {
        const response = await fetch(`/api/user/listes`);
        const listes = await response.json();
        setListes(listes);
    };

    const fetchUserData = async () => {
        const response = await fetch(`/api/user/${session?.user.id}`);
        const data = await response.json();
        setUser({
            email: data.mail,
            firstname: data.prenom,
            lastname: data.nom,
        });

        fetchListes(session?.user.id);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (status === "unauthenticated") {
        router.push("/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-top bg-no-repeat sm:bg-cover sm:bg-center sm:bg-[url('/pictures/connexionIllus.png')] bg-[url('/pictures/IllusConnexion-Mobile.png')] bg-contain">
            {status === "authenticated" && (
                <main className="flex flex-col items-center justify-start sm:justify-center p-8 md:p-32">
                    <div className="bg-white pb-6 sm:pb-8 lg:pb-20 w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl text-center sm:py-1 px-6 sm:px-8 lg:px-20 xl:px-60">
                        {/* User Info */}
                        <div className="space-y-2 tracking-wide justify-center">
                            <h2 className="text-sm md:text-lg font-semibold uppercase text-mediumGreen tracking-widest">Mon profil</h2>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            <a href={`${session?.user.id}/update`}>Éditer</a>
                        </button>
                    </div>
                </main>
            )}
        </div>
    );
}
