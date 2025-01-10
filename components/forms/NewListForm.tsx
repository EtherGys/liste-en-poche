"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArticleInput from "@components/ArticleInput";
import {assignListToUser, createArticles, createList} from "@components/forms/apiHelper";

interface FormValues {
  liste: Liste;
}

interface Article {
    id: number;
    nom: string;
    acheter: boolean;
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

      // Mise à jour de l'état
      setArticles((prev) => [
        ...prev,
        { id: newArticle.id, nom: "", acheter: false },
      ]);
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un article :", error);
    }
  };


  const removeArticle = (id: number) => {
    setArticles((prev) => prev.filter((article) => article.id !== id));
  };

  const updateArticle = (id: number, newNom: string) => {
    setArticles((prev) =>
        prev.map((article) =>
            article.id === id ? { ...article, nom: newNom } : article
        )
    );
  };




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
      console.log(liste);

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
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded">
          {/* Nom de la liste */}
          <div className="mb-4">
            <label className="block font-bold mb-2">Nom de la liste</label>
            <input
                {...register("nom", {required: true, minLength: 2})}
                className="border w-full p-2"
                placeholder="Nom de la liste"
            />

          </div>

          {/* Articles */}
          <div>
            <button
                type="button"
                className="text-blue-500 mb-4"
                onClick={addArticle}
            >
              Ajouter un article
            </button>
            {articles.map((article) => (
                <ArticleInput
                    key={article.id}
                    article={article}
                    onChange={updateArticle}
                    onRemove={removeArticle}
                />
            ))}
          </div>

          {/* Bouton de soumission */}
          <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 text-white p-2 mt-4"
          >
            {submitting ? "En cours..." : "Créer"}
          </button>
        </form>
      </>
  );
}
