"use client";
import { useState } from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { useRouter } from "next/navigation";

interface ResetPasswordFormInputs {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetpasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();

  function errorHandler(
    errorInput: FieldError | undefined,
    minNum: number,
    maxNum: number
  ) {
    return (
      <>
        {errorInput?.type === "required" && (
          <p className="ml-2 text-red-500 text-xs font-light">
            Ce champ est obligatoire
          </p>
        )}
        {errorInput?.type === "minLength" && (
          <p className="ml-2 text-red-500 text-xs font-light">
            Le mot de passe doit contenir au moins {minNum} caractères
          </p>
        )}
        {errorInput?.type === "maxLength" && (
          <p className="ml-2 text-red-500 text-xs font-light">
            Le mot de passe doit contenir au maximum {maxNum} caractères
          </p>
        )}
        {errorInput?.type === "pattern" && (
          <p className="ml-2 text-red-500 text-xs font-light">
            Le mot de passe doit contenir au moins une majuscule, une
            minuscule, un chiffre et un caractère spécial (#?!@$%^&*-).
          </p>
        )}
      </>
    );
  }

  

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    const { email, newPassword } = data;

    setSubmitting(true);
    setSuccessMessage(null);

	try {
		const response = await fetch("/api/reset-password", {
		  method: "PUT",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ email, newPassword }),
		});

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.message || "Une erreur est survenue.");
      }

      setSuccessMessage("Mot de passe réinitialisé avec succès !");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      setSuccessMessage(null);
      console.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800">
          Réinitialiser le mot de passe
        </h1>

        {successMessage && (
          <p className="text-green-500 text-center text-sm mt-4">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Votre adresse email"
              {...register("email", {
                required: "L'email est requis.",
              })}
              className={`mt-2 w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="Votre nouveau mot de passe"
              {...register("newPassword", {
                required: true,
                pattern: {
                  value:
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                  message:
                    "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
                },
                minLength: 8,
                maxLength: 30,
              })}
              className={`mt-2 w-full px-4 py-2 border ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900`}
            />
            {errorHandler(errors.newPassword, 8, 30)}
          </div>

          {/* Confirmer le mot de passe */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirmer le mot de passe"
              {...register("confirmPassword", {
                required: true,
                validate: (value) =>
                  value === watch("newPassword") ||
                  "Les mots de passe ne correspondent pas.",
              })}
              className={`mt-2 w-full px-4 py-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 px-4 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {submitting ? "Réinitialisation..." : "Réinitialiser"}
          </button>
        </form>
      </div>
    </div>
  );
}
