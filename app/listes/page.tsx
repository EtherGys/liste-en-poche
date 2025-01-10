'use client'
import { useState, useEffect } from "react";
import UserLists from "@/components/UserLists";  // Assurez-vous que le chemin est correct

function VoirListes() {
    const [listes, setListes] = useState<any[]>([]);

    // Fonction pour récupérer les listes depuis l'API
    const fetchListes = async () => {
        try {
            const response = await fetch(`/api/user/listes`);
            const data = await response.json();
            setListes(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des listes:", error);
        }
    };

    useEffect(() => {
        fetchListes(); // Charger les listes au montage de la page
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
                fetchListes(); // Rafraîchir la liste après suppression
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de la liste:", error);
        }
    };

    // Fonction pour supprimer un article (à personnaliser si besoin)
    const deleteArticle = async (id: string) => {
        try {
            // Implémenter la logique de suppression si nécessaire
        } catch (error) {
            console.error("Erreur lors de la suppression de l'article:", error);
        }
    };

    // Fonction pour éditer un article (à personnaliser si besoin)
    const EditArticle = async (id: string) => {
        try {
            // Implémenter la logique d'édition si nécessaire
        } catch (error) {
            console.error("Erreur lors de l'édition de l'article:", error);
        }
    };

    return (
        <div className="min-h-screen flex-col items-center justify-center bg-top bg-no-repeat sm:bg-cover sm:bg-center sm:bg-[url('/pictures/connexionIllus.png')] bg-[url('/pictures/IllusConnexion-Mobile.png')] bg-contain">
            {/* Intégration du composant UserLists */}
            <UserLists
                listes={listes}
                onListeDelete={deleteListe}
                onArticleDelete={deleteArticle}
                onArticleEdit={EditArticle}
            />
        </div>
    );
}

export default VoirListes;
