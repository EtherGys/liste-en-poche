import { ChangeEvent } from "react";
interface Article {
    id: number;
    nom: string;
    acheter: boolean;
}

interface ArticleInputProps {
    article: Article;
    onChange: (id: number, value: any) => void;
    onRemove: (id: number) => void;
}

export default function ArticleInput({
                                         article,
                                         onChange,
                                         onRemove,
                                     }: ArticleInputProps) {
    return (
        <div className="border rounded-md m-2 p-4 flex items-center gap-4">
            {/* Champ de saisie du nom de l'article */}
            <input
                type="text"
                value={article.nom}
                onChange={(e) => onChange(article.id, e.target.value)}
                placeholder="Nom de l'article"
                className="w-1/2 p-2 border rounded-md"
            />

            {/* Case à cocher pour "Acheté" */}
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={article.acheter}
                    onChange={(e) => onChange(article.id, e.target.value)}
                    className="w-4 h-4"
                />
                <span>Acheté</span>
            </label>

            {/* Bouton pour supprimer l'article */}
            <button
                type="button"
                onClick={() => onRemove(article.id)}
                className="text-red-500 border border-red-500 rounded p-2"
            >
                Supprimer
            </button>
        </div>
    );
}
