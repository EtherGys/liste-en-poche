'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            {status === "authenticated" && (
                <main className="w-full max-w-4xl mx-auto p-6 sm:p-12 bg-white rounded-lg shadow-md">
                    {/* Header Section */}
                    <header className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-800">Mon Profil</h1>
                        <p className="text-gray-600">Gérez vos informations personnelles</p>
                        <a
                            href={`${session?.user.id}/update`}
                            className="mt-4 inline-block w-full sm:w-auto text-center py-2 px-4 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            Éditer le profil
                        </a>
                    </header>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* User Information */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Lastname */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h2 className="text-sm font-medium text-gray-500">Nom</h2>
                            <p className="text-lg font-semibold text-gray-800">{user.lastname}</p>
                        </div>

                        {/* Firstname */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h2 className="text-sm font-medium text-gray-500">Prénom</h2>
                            <p className="text-lg font-semibold text-gray-800">{user.firstname}</p>
                        </div>

                        {/* Email */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow col-span-full">
                            <h2 className="text-sm font-medium text-gray-500">Email</h2>
                            <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                        </div>
                    </section>
                </main>
            )}
        </div>
    );
}
