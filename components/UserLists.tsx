import React from 'react';

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
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };

        return new Intl.DateTimeFormat('fr-FR', options).format(date).replace(',', ' à');
    };

    return (
        <section>
            {listes.length > 0 ? (
                <ol className="list-decimal pl-6 space-y-4">
                    {listes.map((liste) => (
                        <li key={liste.id_liste} className="border-b py-4">
                            <header className="flex justify-between items-center mb-2">
                                <div>
                                    <h3 className="text-base font-medium">{liste.nom}</h3>
                                    <span className="text-sm text-gray-500">
                    Créée le {formatDate(liste.date_creation)}
                  </span>
                                </div>
                                <button
                                    onClick={() => onListeDelete(liste.id_liste)}
                                    className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-3 rounded"
                                >
                                    Supprimer la liste
                                </button>
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
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-center text-gray-500">Aucune liste disponible.</p>
            )}
        </section>
    );
};

export default UserLists;
