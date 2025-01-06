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
    maxNum: number
  ) {
    return (
      <>
      {errorInput?.type === "required" && (
        <p className="ml-2 text-white text-xs font-light">
        Le mot de passe est obligatoire
        </p>
      )}
      {errorInput?.type === "minLength" && (
        <p className="ml-2 text-white text-xs font-light">
        Le mot de passe doit contenir au moins {minNum} caractères
        </p>
      )}
      {errorInput?.type === "maxLength" && (
        <p className="ml-2 text-white text-xs font-light">
        Le mot de passe doit contenir au maximum {maxNum} caractères
        </p>
      )}
      </>
    );
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
    <section className="min-h-screen flex items-center justify-center bg-top bg-no-repeat sm:bg-cover sm:bg-center sm:bg-[url('/pictures/IllusInscription.png')] bg-[url('/pictures/IllusRegistrationMobile.png')] bg-contain">
    <ToastContainer />
    <div className="container mx-auto mt-4 px-8 sm:fixed md:relative top-0 md:mt-0 bg-black pb-6 pt-6 sm:pt-6 sm:pb-6 w-9/12 sm:w-full max-w-xs sm:max-w-lg lg:max-w-xl 2xl:max-w-4xl text-center mx-4">
    <div className="flex justify-center mt-8 sm:mt-10 sm:mt-4 text-xl sm:text-2xl font-playfair text-center text-white">
    Inscription
    </div>    
    <div className="flex justify-center mt-2">
    <NavigationLink
    className="text-sm text-right text-white"
    href={"/login"}
    >
    Vous avez déjà un compte ? 
    <span className="pl-2 underline text-white">Connexion</span>
    </NavigationLink>
    </div>
    
    <form
    onSubmit={handleSubmit(onSubmit)}
    noValidate
    className="mt-8 sm:mt-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col gap-7 mx-auto"
    >
    {/* lastname */}
    <label
    className="block -mb-2 sm:mb-2 text-sm font-medium text-white"
    htmlFor="lastname"
    >
    <input
    type="text"
    value={user.lastname}
    {...register("lastname", {
      required: true,
      minLength: 2,
      maxLength: 200,
      onChange: (e: any) =>
        setUser({
        ...user,
        lastname: e.target.value,
      }),
    })}
    name="lastname"
    id="lastname"
    placeholder="Nom de famille"
    required
    className="bg-transparent border-0 border-b border-white text-white text-sm 2xl:text-base font-normal placeholder-white block w-full p-1 focus:ring-0 focus:border-white text-lg font-medium"
    ></input>
    {errorHandler(errors.lastname, 2, 200)}
    </label>
    
    {/* firstname */}
    <label
    className="block -mb-2 sm:mb-2 text-sm font-medium text-white"
    htmlFor="firstname"
    >
    <input
    type="text"
    value={user.firstname}
    {...register("firstname", {
      required: true,
      minLength: 2,
      maxLength: 200,
      onChange: (e: any) =>
        setUser({
        ...user,
        firstname: e.target.value,
      }),
    })}
    name="firstname"
    id="firstname"
    placeholder="Prénom"
    required
    className="bg-transparent border-0 border-b border-white text-white text-sm 2xl:text-base font-normal placeholder-white block w-full p-1 focus:ring-0 focus:border-white text-lg font-medium"
    ></input>
    {errorHandler(errors.firstname, 2, 200)}
    </label>
    
    
    
    {/* Email */}
    <label
    className="block -mb-2 sm:mb-2 text-sm font-medium text-white"
    htmlFor="email"
    >
    <input
    type="email"
    value={user.email}
    {...register("email", {
      required: true,
      minLength: 2,
      maxLength: 150,
      onChange: (e) =>
        setUser({
        ...user,
        email: e.target.value,
      }),
    })}
    name="email"
    id="email"
    placeholder="Email"
    required
    className="bg-transparent border-0 border-b border-white text-white text-sm 2xl:text-base font-normal placeholder-white block w-full p-1 focus:ring-0 focus:border-white text-lg font-medium"
    />
    {errorHandler(errors.email, 6, 255)}
    {errors.email && (
      <p role="alert" className="ml-2 text-white">
      {errors.email.message}
      </p>
    )}
    </label>
    
    
    {/* Password */}
    <label
    className="block -mb-2 sm:mb-2 text-sm font-medium text-white"
    htmlFor="password"
    >
    <input
    type="password"
    value={user.password}
    {...register("password", {
      required: true,
      pattern: {
        value:
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        message: `Erreur`,
      },
      minLength: 8,
      maxLength: 30,
      onChange: (e) => setUser({ ...user, password: e.target.value }),
    })}
    name="password"
    id="password"
    placeholder="Mot de passe"
    className="bg-transparent border-0 border-b border-white text-white text-sm 2xl:text-base font-normal placeholder-white block w-full p-1 focus:ring-0 focus:border-white text-lg font-medium"
    />
    {errorHandler(errors.password, 8, 30)}
    {errors.password && (
      <p role="alert" className="ml-2 text-white">
      {(errors.password as FieldError).message}
      </p>
    )}
    </label>
    
    {/* Password Confirmation */}
    <label
    className="block -mb-2 sm:mb-2 text-sm font-medium text-white"
    htmlFor="confirmPassword"
    >
    <input
    type="password"
    value={user.confirmPassword}
    {...register("confirmPassword", {
      required: true,
      validate: (value) =>
        value === user.password || "Erruer",
      onChange: (e) =>
        setUser({ ...user, confirmPassword: e.target.value }),
    })}
    name="confirmPassword"
    id="confirmPassword"
    placeholder="Confirmer le mot de passe"
    className="bg-transparent border-0 border-b border-white text-white text-sm 2xl:text-base font-normal placeholder-white block w-full p-1 focus:ring-0 focus:border-white text-lg font-medium"
    />
    {errorHandler(errors.confirmPassword, 8, 30)}
    {errors.confirmPassword && (
      <p role="alert" className="ml-2 text-white">
      {(errors.confirmPassword as FieldError).message}
      </p>
    )}
    </label>
    
    {/* submit button */}
    <div className="flex flex-col justify-center items-center mx-3 mt-2 sm:mt-10 gap-4 mb-5">
    <button
    type="submit"
    disabled={submitting}
    className="text-xs 2xl:text-base font-medium bg-white text-black py-1 px-6"
    >
    {submitting ? `En cours` : `Inscription`}
    </button>
    </div>
    </form>
    </div>
    </section>
  );
}