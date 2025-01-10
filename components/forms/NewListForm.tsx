"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArticleInput from "@components/ArticleInput";
import { createList } from "@components/forms/apiHelper";

interface Article {
  id: number;
  nom: string;
  acheter: boolean;
  qte: number;
}

interface Liste {
  id: number;
  nom: string;
  articles: Article[];
}

export default function NewListForm() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<{ nom: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Ajouter un article
  const addArticle = async () => {
    try {
      // Enregistrement de l'article en base
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

      const newArticle = await response.json(); // Récupère l'article créé avec son ID

      // Mise à jour de l'état en utilisant id_article plutôt que id
      setArticles((prev) => [
        ...prev,
        { id: newArticle.id_article, nom: "", acheter: false, qte: 1 },
      ]);

      console.log("Article ajouté", newArticle);
      console.log(articles); // Vérification de l'état des articles
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un article :", error);
    }
  };

  // Supprimer un article
  const removeArticle = (id: number) => {
    setArticles((prev) => prev.filter((article) => article.id !== id));
  };

  // Mise à jour d'un article
  const updateArticle = (
    id: number,
    newNom: string,
    newQte: number,
    newAcheter: boolean
  ) => {
    setArticles((prev) => {
      console.log("Update article", id, newNom, newQte, newAcheter);
      return prev.map((article) =>
        article.id === id
          ? { ...article, nom: newNom, qte: newQte, acheter: newAcheter }
          : article
      );
    });
  };

  // Soumettre le formulaire
  const onSubmit = async (data: { nom: string }) => {
    setSubmitting(true);
    try {
      if (articles.some((article) => !article.nom.trim())) {
        toast.error("Tous les articles doivent avoir un nom.");
        setSubmitting(false);
        return;
      }

      const liste: Liste = {
        id: 0, // placeholder, si l'ID est généré en base
        nom: data.nom,
        articles,
      };
      await createList(liste);

      toast.success("Liste créée avec succès !");
      router.push(`/dashboard`);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la liste !");
    } finally {
      setSubmitting(false);
    }
  };

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
            <label htmlFor="nom" className="block font-bold mb-2 text-lg">
              Nom de la liste
            </label>
            <input
              {...register("nom", { required: true, minLength: 2 })}
              className="border w-full p-2 rounded-md focus:ring-2 focus:ring-red-500"
              id="nom"
              placeholder="Nom de la liste"
            />
          </section>

          {/* Liste des articles */}
          <section>
            <ul className="space-y-4">
              {articles.map((article) => (
                <li key={article.id}>
                  <ArticleInput
                    article={article}
                    onChange={updateArticle}
                    onRemove={removeArticle}
                  />
                </li>
              ))}
            </ul>

            {/* Ajouter un article */}
            <button
              type="button"
              onClick={addArticle}
              className="text-red-500 mt-4 block"
            >
              Ajouter un article
            </button>
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
