"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import NavigationLink from "../NavigationLink";
import { signIn, useSession } from "next-auth/react";

export default function LoginForm() {
  const [error, setError] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const onSubmit: SubmitHandler<any> = async () => {
    try {
      const res = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (res?.error) {
        setError(true);
        router.push('/login');
        return;
      }
      router.push('/profil');

    } catch (error) {
      console.log(error);
    }
  };

  function errorHandler(errorInput: any) {
    if (errorInput?.type === "required") {
      return <p className="text-sm text-red-500">Ce champ est requis</p>;
    }
    if (errorInput?.type === "pattern") {
      return <p className="text-sm text-red-500">L'email doit être valide.</p>;
    }
    return null;
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-10 w-full max-w-md">
        {/* Titre */}
        <h1 className="text-3xl font-semibold text-center text-gray-800">Connexion</h1>

        {/* Lien d'inscription */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Première visite ?{" "}
          <NavigationLink href="/register" className="text-red-500 underline">
            Inscription
          </NavigationLink>
        </p>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6 mt-6"
        >
          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "L'email doit être valide.",
                },
                onChange: (e) => setUser({ ...user, email: e.target.value }),
              })}
              placeholder="Votre adresse email"
              className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
            {errorHandler(errors.email)}
          </div>

          {/* Champ Mot de passe */}
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
                onChange: (e) => setUser({ ...user, password: e.target.value }),
              })}
              placeholder="Votre mot de passe"
              className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
            {errorHandler(errors.password)}
            <p className="text-center text-sm text-gray-600 mt-4">
              <NavigationLink href="/reset-password" className="text-red-500 underline">
                Mot de passe perdu ?
              </NavigationLink>
            </p>
          </div>

          {/* Message d'erreur général */}
          {error && <p className="text-sm text-red-500 text-center">Identifiants incorrects</p>}

          {/* Bouton de soumission */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Connexion
          </button>
        </form>
      </div>
    </section>
  );
}
