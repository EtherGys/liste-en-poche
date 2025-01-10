"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArticleInput from "@components/ArticleInput";
import { createList } from "@components/forms/apiHelper";
import { AiOutlineLock, AiOutlineGlobal } from "react-icons/ai"; // Utilisation de l'icône AiOutlineGlobal

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
  publique: boolean;
}

interface FormValues {
  nom: string;
  publique: boolean;
}

export default function NewListForm() {
  const router = useRouter();
  const { register, handleSubmit, formState, setValue, watch } = useForm<{ nom: string, publique: boolean }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Ajouter un article
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

  // Supprimer un article
  const removeArticle = (id_article: number) => {
    setArticles((prev) => prev.filter((article) => article.id_article !== id_article));
  };

  // Mise à jour d'un article
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

  // Soumettre le formulaire
  const onSubmit = async (data: { nom: string, publique: boolean }) => {
    setSubmitting(true);
    try {
      if (articles.some((article) => !article.nom.trim())) {
        toast.error("Tous les articles doivent avoir un nom.");
        setSubmitting(false);
        return;
      }

      const liste: Liste = {
        id_liste: 0, // Placeholder si l'ID est généré en base
        nom: data.nom,
        articles,
        publique: data.publique, // Prendre en compte l'état du champ publique
      };

      await createList(liste);

      toast.success("Liste créée avec succès !");
      router.push(`/dashboard`);
    } catch (error) {
      toast.error("Erreur lors de la création de la liste !");
    } finally {
      setSubmitting(false);
    }
  };

  const isPublic = watch("publique");

  return (
      <>
        <ToastContainer />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
          <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-lg space-y-6 p-6 bg-white rounded-lg shadow-lg"
          >
            {/* Nom de la liste */}
            <section className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="nom" className="font-bold text-lg">
                  Nom de la liste
                </label>
                <span className="text-lg">
              {isPublic ? (
                  <AiOutlineGlobal className="text-green-500" />
              ) : (
                  <AiOutlineLock className="text-gray-500" />
              )}
            </span>
              </div>
              <input
                  {...register("nom", { required: "Le nom est requis" })}
                  className="border w-full p-2 rounded-md focus:ring-2 focus:ring-red-500"
                  id="nom"
                  placeholder="Nom de la liste"
              />
            </section>

            {/* Liste des articles */}
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

            {/* Rendre publique (Checkbox) */}
            <section className="mt-4">
              <div className="flex justify-between items-center">
                <label className="font-bold">Liste publique ? </label>
                <input
                    type="checkbox"
                    id="publique"
                    {...register("publique")}
                    className="form-checkbox h-5 w-5 text-red-500 border-gray-300 rounded"
                />
              </div>
            </section>

            {/* Bouton de soumission */}
            <section className="mt-4">
              <button
                  type="submit"
                  disabled={submitting}
                  className="bg-red-500 text-white p-2 w-full rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {submitting ? "En cours..." : "Créer la liste"}
              </button>
            </section>
          </form>
        </div>
      </>
  );
}
