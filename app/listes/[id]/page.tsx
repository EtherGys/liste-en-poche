"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArticleInput from "@components/ArticleInput";
import { createList, updateList } from "@components/forms/apiHelper";

interface Article {
    id_article: number;
    nom: string;
    acheter: boolean;
    qte: number;
}

interface Liste {
    id_liste: number;
    nom: string;
    articles: Article[];
}

export default function EditListForm({ id }: { id: string }) {
    const router = useRouter();
    const { register, handleSubmit, formState } = useForm<{ nom: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [currentList, setCurrentList] = useState<Liste | null>(null);

    // Récupérer la liste existante et les articles associés au montage
    useEffect(() => {
        const fetchListData = async () => {
            const response = await fetch(`/api/listes/${id}`);
            if (response.ok) {
                const data = await response.json();
                setCurrentList(data);
                setArticles(data.articles);  // Initialiser les articles dans le formulaire
            } else {
                toast.error("Erreur lors du chargement de la liste.");
            }
        };

        fetchListData();
    }, [id]);

    const addArticle = async () => {
        try {
            const response = await fetch("/api/articles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nom: "", acheter: false }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la création de l'article.");
            }

            const newArticle = await response.json();
            setArticles((prev) => [
                ...prev,
                { id_article: newArticle.id_article, nom: "", acheter: false, qte: 1 },
            ]);
        } catch (error) {
            toast.error("Erreur lors de l'ajout d'un article.");
        }
    };

    const removeArticle = (id_article: number) => {
        setArticles((prev) => prev.filter((article) => article.id_article !== id_article));
    };

    const updateArticle = (
        id_article: number,
        newNom: string,
        newQte: number,
        newAcheter: boolean
    ) => {
        setArticles((prev) => {
            return prev.map((article) =>
                article.id_article === id_article
                    ? { ...article, nom: newNom, qte: newQte, acheter: newAcheter }
                    : article
            );
        });
    };

    const onSubmit = async (data: { nom: string }) => {
        setSubmitting(true);
        try {
            if (articles.some((article) => !article.nom.trim())) {
                toast.error("Tous les articles doivent avoir un nom.");
                setSubmitting(false);
                return;
            }

            const updatedListe: Liste = {
                id_liste: currentList?.id_liste || 0,
                nom: data.nom,
                articles,
            };

            await updateList(updatedListe);

            toast.success("Liste mise à jour avec succès !");
            router.push(`/dashboard`);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour de la liste.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
                {currentList && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full max-w-lg space-y-6 p-6 bg-white rounded-lg shadow-lg"
                    >
                        <section className="mb-4">
                            <label htmlFor="nom" className="block font-bold mb-2 text-lg">
                                Nom de la liste
                            </label>
                            <input
                                {...register("nom", { required: true, minLength: 2 })}
                                className="border w-full p-2 rounded-md focus:ring-2 focus:ring-red-500"
                                id="nom"
                                defaultValue={currentList.nom}  // Initialiser avec le nom existant
                                placeholder="Nom de la liste"
                            />
                        </section>

                        <section>
                            <ul className="space-y-4">
                                {articles.map((article) => (
                                    <li key={article.id_article}>
                                        <ArticleInput
                                            article={article}
                                            onChange={updateArticle}
                                            onRemove={removeArticle}
                                        />
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                onClick={addArticle}
                                className="text-red-500 mt-4 block"
                            >
                                Ajouter un article
                            </button>
                        </section>

                        <section className="mt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-red-500 text-white p-2 w-full rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                {submitting ? "En cours..." : "Mettre à jour la liste"}
                            </button>
                        </section>
                    </form>
                )}
            </div>
        </>
    );
}
