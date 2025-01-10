"use client";
import { useState } from "react";
import { SubmitHandler, useForm, FieldError } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import NavigationLink from "../NavigationLink";

interface RegisterForm {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [user, setUser] = useState<RegisterForm>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const notify = () =>
    toast.success("Succès", {
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
  } = useForm<RegisterForm>();

  function errorHandler(
    errorInput: FieldError | undefined,
    minNum: number,
    maxNum: number,
    errorMessage: string = "Erreur"
  ) {
    if (errorInput) {
      if (errorInput.type === "required") {
        return <p className="text-sm text-red-500 mt-1">Ce champ est obligatoire.</p>;
      } else if (errorInput.type === "minLength") {
        return <p className="text-sm text-red-500 mt-1">Minimum {minNum} caractères.</p>;
      } else if (errorInput.type === "maxLength") {
        return <p className="text-sm text-red-500 mt-1">Maximum {maxNum} caractères.</p>;
      } else if (errorInput.type === "pattern") {
        return <p className="text-sm text-red-500 mt-1">{errorMessage}</p>;
      } else if (errorInput.type === "validate") {
        return <p className="text-sm text-red-500 mt-1">{errorInput.message}</p>;
      }
    }
    return null;
  }

  async function createUser() {
    setSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: user.email,
          password: user.password,
          nom: user.lastname,
          prenom: user.firstname,
        }),
      });
      if (response.ok) {
        notify();
        setTimeout(() => {
          router.push(`/login`);
        }, 5000);
      }
      setSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit: SubmitHandler<any> = () => {
    createUser();
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg px-8 py-10 w-full max-w-md">
        {/* Titre */}
        <h1 className="text-3xl font-semibold text-center text-gray-800">Inscription</h1>

        {/* Lien de connexion */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Vous avez déjà un compte ?{" "}
          <NavigationLink href="/login" className="text-red-500 underline">
            Connexion
          </NavigationLink>
        </p>

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
                required: true,
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
                required: true,
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
            {errorHandler(errors.email, 6, 255, "L'email doit être valide.")}
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={user.password}
              {...register("password", {
                required: true,
                pattern: {
                  value:
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                  message: `Le mot de passe doit contenir des majuscules, minuscules, chiffres et caractères spéciaux.`,
                },
                minLength: 8,
                maxLength: 30,
                onChange: (e) => setUser({ ...user, password: e.target.value }),
              })}
              placeholder="Votre mot de passe"
              className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
            {errorHandler(errors.password, 8, 30, `Le mot de passe doit contenir des majuscules, minuscules, chiffres et caractères spéciaux.`)}
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={user.confirmPassword}
              {...register("confirmPassword", {
                required: true,
                validate: (value) =>
                  value === user.password || "Les mots de passe doivent correspondre.",
                onChange: (e) =>
                  setUser({ ...user, confirmPassword: e.target.value }),
              })}
              placeholder="Confirmez votre mot de passe"
              className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
            {errorHandler(errors.confirmPassword, 8, 30)}
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 px-4 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {submitting ? "En cours..." : "Inscription"}
          </button>
        </form>
      </div>
    </section>
  );
}
