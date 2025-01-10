"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Utilisation de useParams pour accéder aux paramètres dynamiques d'URL

interface Article {
    id_article: string;
    nom: string;
    qte: number;
}

interface Liste {
    id_liste: string;
    nom: string;
    date_creation: string;
    articles?: Article[];
}

const ListeDetail = () => {
    const { id } = useParams() as { id: string };  // Utilisation de useParams pour récupérer l'ID
    const [liste, setListe] = useState<Liste | null>(null);
    const [canEdit, setCanEdit] = useState(false); // Détermine si l'utilisateur peut modifier

    const fetchListeDetails = async () => {
        try {
            const response = await fetch(`/api/listes/${id}`);
            if (response.status === 401) {
                console.error("Non autorisé");
                // Si l'utilisateur n'est pas autorisé, rediriger ailleurs ou afficher une erreur
                return;
            }
            if (response.ok) {
                const data = await response.json();
                setListe(data);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des détails de la liste :", error);
        }
    };

    const checkPermissions = async () => {
        try {
            const response = await fetch(`/api/listes/${id}`);
            if (response.status === 200) {
                setCanEdit(true);
            }
        } catch (error) {
            console.error("Erreur lors de la vérification des permissions :", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchListeDetails();
            checkPermissions();
        }
    }, [id]);

    if (!liste) {
        return <div>Chargement des détails de la liste...</div>;
    }

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">{liste.nom}</h1>
                <p className="text-gray-500">
                    Créée le {new Date(liste.date_creation).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                </p>
            </header>

            {/* Mode édition */}
            {canEdit ? (
                <div>
                    <h2 className="text-xl font-semibold">Mode édition</h2>
                    <ul className="list-disc pl-6 mt-4">
                        {liste.articles?.map((article) => (
                            <li key={article.id_article} className="mb-2">
                                <span className="font-medium">{article.nom}</span> - Quantité :{" "}
                                <input
                                    type="number"
                                    className="border rounded p-1 w-16"
                                    defaultValue={article.qte}
                                />
                            </li>
                        ))}
                    </ul>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700">
                        Sauvegarder les modifications
                    </button>
                </div>
            ) : (
                // Mode consultation
                <div>
                    <h2 className="text-xl font-semibold">Mode consultation</h2>
                    {liste.articles && liste.articles.length > 0 ? (
                        <ul className="list-disc pl-6 mt-4">
                            {liste.articles.map((article) => (
                                <li key={article.id_article}>
                                    <span className="font-medium">{article.nom}</span> - Quantité : {article.qte}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-4">Aucun article dans cette liste.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListeDetail;
