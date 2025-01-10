'use client';
import { useState, useEffect } from "react";
import UserLists from "@/components/UserLists"; // Assurez-vous que le chemin est correct

function VoirListes() {
    const [mesListes, setMesListes] = useState<any[]>([]);
    const [listesPubliques, setListesPubliques] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Fonction pour récupérer les listes de l'utilisateur
    const fetchMesListes = async () => {
        try {
            const response = await fetch(`/api/user/listes`);
            const data = await response.json();
            setMesListes(data);
        } catch (error) {
            console.error("Erreur lors de la récupération de mes listes :", error);
        }
    };

    // Fonction pour récupérer les listes publiques
    const fetchListesPubliques = async () => {
        try {
            const response = await fetch(`/api/listes`);
            const data = await response.json();
            setListesPubliques(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des listes publiques :", error);
        }
    };

    useEffect(() => {
        fetchMesListes(); // Charger mes listes
        fetchListesPubliques(); // Charger les listes publiques
    }, []);

    // Fonction pour supprimer une liste
    const deleteListe = async (id: string) => {
        try {
            const response = await fetch(`/api/listes/${id}`, {
                method: "DELETE",
                body: JSON.stringify({
                    id_liste: id,
                }),
            });
            if (response.ok) {
                fetchMesListes(); // Rafraîchir mes listes après suppression
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de la liste :", error);
        }
    };

    // Gestion de la recherche
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredMesListes = mesListes.filter((liste) =>

        liste.nom && liste.nom.toLowerCase().includes(searchQuery)
    );

    const filteredListesPubliques = listesPubliques.filter((liste) =>
        liste.nom && liste.nom.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="min-h-screen flex-col items-center justify-center bg-top bg-no-repeat sm:bg-cover sm:bg-center sm:bg-[url('/pictures/connexionIllus.png')] bg-[url('/pictures/IllusConnexion-Mobile.png')] bg-contain">
            <div className="container mx-auto p-4">
                
                {/* Champ de recherche */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Rechercher une liste..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Mes listes */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Mes Listes</h2>
                    {filteredMesListes.length > 0 ? (
                        <UserLists
                            listes={filteredMesListes}
                            onListeDelete={deleteListe}
                            onArticleDelete={() => {}}
                            onArticleEdit={() => {}}
                        />
                    ) : (
                        <p>Aucune liste trouvée.</p>
                    )}
                </section>

                {/* Listes publiques */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Listes Publiques</h2>
                    {filteredListesPubliques.length > 0 ? (
                        <UserLists
                            listes={filteredListesPubliques}
                            onListeDelete={deleteListe}
                            onArticleDelete={() => {}}
                            onArticleEdit={() => {}}
                        />
                    ) : (
                        <p>Aucune liste publique trouvée.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default VoirListes;
