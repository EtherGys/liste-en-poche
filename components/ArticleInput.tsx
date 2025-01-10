import React from "react";

interface Article {
    id_article: number;
    nom: string;
    acheter: boolean;
    qte: number;
}

interface ArticleInputProps {
    article: Article;
    onChange: (id: number, newNom: string, newQte: number, newAcheter: boolean) => void;
    onRemove: (id: number) => void;
}

const ArticleInput: React.FC<ArticleInputProps> = ({ article, onChange, onRemove }) => {
    const handleNomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(article.id_article, e.target.value, article.qte, article.acheter);
    };

    const handleQteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newQte = value === "" ? 0 : parseInt(value, 10); // Gérer valeur vide
        if (!isNaN(newQte)) {
            onChange(article.id_article, article.nom, newQte, article.acheter);
        }
    };

    const handleAcheterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(article.id_article, article.nom, article.qte, e.target.checked);
    };

    return (
        <div className="flex items-center mb-4">
            {/* Checkbox "Acheter" */}
            <input
                type="checkbox"
                checked={article.acheter}
                onChange={handleAcheterChange}
                className="mr-2"
            />

            {/* Nom de l'article */}
            <input
                type="text"
                value={article.nom}
                onChange={handleNomChange}
                placeholder="Nom de l'article"
                className="border p-2 flex-1 mr-2"
            />

            {/* Quantité */}
            <input
                type="number"
                value={article.qte}
                onChange={handleQteChange}
                min="0"
                className="border p-2 w-20 text-center mr-2"
                placeholder="Quantité"
            />

            {/* Bouton pour supprimer l'article */}
            <button
                type="button"
                onClick={() => onRemove(article.id_article)}
                className="bg-red-500 text-white p-2 ml-2"
            >
                Supprimer
            </button>
        </div>
    );
};

export default ArticleInput;
