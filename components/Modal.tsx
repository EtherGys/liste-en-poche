"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";


interface articleForm {
    id: string;
    nom: string;
    qte: string;
    acheter: string;
  }
  

export function Modal({id}: {id: string}) {
      const [submitting, setSubmitting] = useState(false);
    const [article, setArticle] = useState({
        id: "",
        nom: "",
        qte: "",
        acheter: "",
    });
    
 const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<articleForm>();

  const notify = () =>
    toast.success("Modification validée", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });


const updateArticle = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          nom: article.nom,
         acheter : article.acheter
        }),
      });
      if (response.ok) {
        notify();

      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
}

 const onSubmit: SubmitHandler<any> = () => {
    updateArticle();
  };

  const fetchArticle = async () => {
    const response = await fetch(`/api/articles/${article.id}`);
    const data = await response.json();  
    setArticle({
      nom: article.nom,
      acheter : article.acheter,
      qte: article.qte,
      id: article.id
    });
    
  };

 useEffect(() => {
      fetchArticle();
  }, []);

    return (
        
        <div className="z-50 absolute p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Modification de l'article {article.nom}</h3>
        <div className="mt-2 px-7 py-3">
        <div className="m-2 p-2">
        <form
    onSubmit={handleSubmit(onSubmit)}
    noValidate
    className="mt-8 sm:mt-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col gap-7 mx-auto"
    >
        <label
    className="block -mb-2 sm:mb-2 text-sm font-medium "
    htmlFor="article"
    >
    <input
    type="text"
    value={article.nom}
    {...register("nom", {
      required: true,
      minLength: 2,
      maxLength: 200,
      onChange: (e: any) =>
        setArticle(
        e.target.value,
      ),
    })}
    name="article"
    id="article"
    placeholder="Nom de la nouvelle article"
    required
    className="bg-transparent border-0 border-b   text-sm 2xl:text-base font-normal  block w-full p-1 focus:ring-0 focus: text-lg font-medium"
    ></input>
    </label>
    
        <div className="flex flex-row mt-4">
        <div className="flex items-center mb-4">
        <input value={article.acheter}
    {...register("acheter", {
      required: true,
      minLength: 2,
      maxLength: 200,
      onChange: (e: any) =>
        setArticle(
        e.target.value,
      ),
    })} id="default-checkbox" type="checkbox"  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Acheté</label>
        </div>
        
        
        <label  className=" px-4 pt-1 text-sm">Quantité</label>
        <input value={article.qte}
    {...register("qte", {
      required: true,
      minLength: 2,
      maxLength: 200,
      onChange: (e: any) =>
        setArticle(
        e.target.value,
      ),
    })} type="number" id="number-input" aria-describedby="helper-text-explanation" className=" w-[15%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" required />
        </div>
        
        
        </form>
        </div>
        </div>
         {/* submit button */}
    <div className="flex justify-center mt-6">
    <button
    type="submit"
    disabled={submitting}
    className=" border text-xs 2xl:text-base font-medium bg-white text-black py-1 px-6"
    >
    {submitting ? `En cours` : `Modifier`}
    </button>
    </div>
        </div>
        </div>
      
    );
}
