"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";

interface UpdateForm {
  firstname?: string;
  lastname?: string;
  email?: string;
}

export default function ProfileUpdateForm() {
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState({
    email: "",
    firstname: "",
    lastname: "",
  });

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateForm>();

  async function updateUser() {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/user/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({
          mail: user.email,
          nom: user.lastname,
          prenom: user.firstname,
        }),
      });
      if (response.ok) {
        notify();
        setTimeout(() => {
          router.push(`/${session?.user?.id}`);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`/api/user/${params.id}`);
      const data = await response.json();
      setUser({
        email: data.mail,
        firstname: data.prenom,
        lastname: data.nom,
      });
    };
    if (params.id) {
      fetchUserData();
    }
  }, []);

  function errorHandler(errorInput: any, minNum: number, maxNum: number, errorMessage?: string) {
    if (errorInput) {
      if (errorInput.type === "required") {
        return <p className="text-sm text-red-500 mt-1">Ce champ est obligatoire.</p>;
      }
      if (errorInput.type === "minLength") {
        return <p className="text-sm text-red-500 mt-1">Minimum {minNum} caractères.</p>;
      }
      if (errorInput.type === "maxLength") {
        return <p className="text-sm text-red-500 mt-1">Maximum {maxNum} caractères.</p>;
      }
      if (errorInput.type === "pattern") {
        return <p className="text-sm text-red-500 mt-1">{errorMessage}</p>;
      }
    }
    return null;
  }

  const onSubmit: SubmitHandler<UpdateForm> = () => updateUser();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg px-8 py-10 w-full max-w-md">
        {/* Titre */}
        <h1 className="text-3xl font-semibold text-center text-gray-800">Modifier mes données</h1>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6 mt-6">
          {/* Nom */}
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              id="lastname"
              value={user.lastname}
              {...register("lastname", {
                minLength: 2,
                maxLength: 200,
                onChange: (e) =>
                  setUser({
                    ...user,
                    lastname: e.target.value,
                  }),
              })}
              placeholder="Votre nom"
              className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
            {errorHandler(errors.lastname, 2, 200)}
          </div>

          {/* Prénom */}
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              id="firstname"
              value={user.firstname}
              {...register("firstname", {
                minLength: 2,
                maxLength: 200,
                onChange: (e) =>
                  setUser({
                    ...user,
                    firstname: e.target.value,
                  }),
              })}
              placeholder="Votre prénom"
              className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
            {errorHandler(errors.firstname, 2, 200)}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              {...register("email", {
                required: "Ce champ est obligatoire.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Veuillez entrer une adresse email valide.",
                },
                onChange: (e) =>
                  setUser({
                    ...user,
                    email: e.target.value,
                  }),
              })}
              placeholder="Votre adresse email"
              className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
            {errorHandler(errors.email, 6, 255, "Veuillez entrer une adresse email valide.")}
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 px-4 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {submitting ? "En cours..." : "Modifier"}
          </button>
        </form>
      </div>
    </section>
  );
}
