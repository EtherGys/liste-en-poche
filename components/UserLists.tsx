import React from "react";
import Link from "next/link"; // Importer le composant Link

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

interface UserListsProps {
    listes: Liste[];
    onListeDelete: (id: string) => void;
    onArticleDelete: (id: string) => void;
    onArticleEdit: (id: string) => void;
}

const UserLists: React.FC<UserListsProps> = ({ listes, onListeDelete, onArticleDelete, onArticleEdit }) => {
    // Fonction pour formater les dates
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };

        return new Intl.DateTimeFormat("fr-FR", options).format(date).replace(",", " à");
    };

    return (
        <section>
            {listes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {listes.map((liste) => (
                        <div
                            key={liste.id_liste}
                            className="bg-transparent border border-gray-300 rounded-lg p-6 space-y-4 flex flex-col"
                        >
                            <header className="flex flex-col justify-center items-center mb-4">
                                {/* Nom de la liste en rouge, centré, et cliquable */}
                                <h3 className="text-lg font-medium text-red-600 text-center">
                                    <Link
                                        href={`/listes/${liste.id_liste}`}
                                        className="hover:underline"
                                    >
                                        {liste.nom}
                                    </Link>
                                </h3>
                                <span className="text-sm text-gray-500">
                                    Créée le {formatDate(liste.date_creation)}
                                </span>
                            </header>

                            {/* Articles associés à la liste */}
                            {liste.articles && liste.articles.length > 0 && (
                                <ul className="ml-4 space-y-2">
                                    {liste.articles.map((article) => (
                                        <li key={article.id_article} className="flex items-center justify-between py-2 border-b">
                                            <div>
                                                <div className="text-base font-medium">{article.nom}</div>
                                                <div className="text-sm">Quantité : {article.qte}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Cas où aucun article n'est associé à la liste */}
                            {!liste.articles?.length && (
                                <p className="text-gray-500 text-sm">Aucun article associé à cette liste.</p>
                            )}

                            {/* Bouton supprimer la liste centré en bas */}
                            <div className="mt-auto text-center">
                                <button
                                    onClick={() => onListeDelete(liste.id_liste)}
                                    className="bg-red-500 hover:bg-red-700 text-white text-xs py-2 px-4 rounded"
                                >
                                    Supprimer la liste
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">Aucune liste disponible.</p>
            )}
        </section>
    );
};

export default UserLists;
