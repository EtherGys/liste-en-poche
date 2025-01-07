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
  telephone?: string;
  profession?: string;
  address?: string;
}
export default function ProfileUpdateForm() {



  const [submitting, setSubmitting] = useState(false);
  const { data: session, status } = useSession();

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
          lastname: data.nom
      });
      
    };
    if (params.id != undefined) {
      fetchUserData();
    }
  }, []);



  function errorHandler(errorInput: any, minNum: number, maxNum: number) {
    return (
      <>
        {errorInput && errorInput.type === "minLength" && (
          <span className="ml-2 text-red-600">
            Le champ doit contenir au moins {minNum} caractères
          </span>
        )}
        {errorInput && errorInput.type === "maxLength" && (
          <span className="ml-2 text-red-600">
            Le champ doit contenir moins de {maxNum} caractères
          </span>
        )}
      </>
    );
  }

  const onSubmit: SubmitHandler<UpdateForm> = () => updateUser();
 
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-12 md:pt-0">
      <ToastContainer />
      <div className="pb-6 sm:pb-8 lg:pb-20 w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl sm:py-1 px-12 sm:px-8 lg:px-20 xl:px-60">
        <h1 className="text-3xl sm:text-4xl 2xl:text-5xl font-playfair text-darkGray mt-10 mb-6 md:mt-8 md:mb-24 text-center">
          Modifier mes données
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Première colonne */}
            <div className="flex-1 space-y-8">
              <label
                htmlFor="lastName"
                className="block text-xs font-light text-darkGray"
              >
               Nom
                <input
                  type="text"
                  value={user.lastname}
                  {...register("lastname", {
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
                  placeholder="Nom"
                  className="bg-transparent border-b border-0 border-darkGray text-darkGray text-sm 2xl:text-base font-medium placeholder-darkGray block w-full p-0 pt-3 pb-1 dark:border-white dark:text-black dark:placeholder-transparent focus:ring-0 focus:border-darkGray focus:outline-none"
                />
                {errorHandler(errors.lastname, 2, 60)}
              </label>
              <label
                htmlFor="firstName"
                className="block text-xs font-light text-darkGray mb-2"
              >
                Prénom
                <input
                  type="text"
                  value={user.firstname}
                  {...register("firstname", {
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
                  className="bg-transparent border-b border-0 border-darkGray text-darkGray text-sm 2xl:text-base font-medium placeholder-darkGray block w-full pl-0 pt-3 pb-1 dark:border-white dark:text-black dark:placeholder-transparent focus:ring-0 focus:border-darkGray focus:outline-none"
                />
                {errorHandler(errors.firstname, 2, 60)}
              </label>
              <label
                htmlFor="email"
                className="block text-xs font-light text-darkGray mb-2"
              >
                Email
                <input
                  type="email"
                  value={user.email}
                  {...register("email", {
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
                  className="bg-transparent border-b border-0 border-darkGray text-darkGray text-sm 2xl:text-base font-medium placeholder-darkGray block w-full pl-0 pt-3 pb-1 dark:border-white dark:text-black dark:placeholder-transparent focus:ring-0 focus:border-darkGray focus:outline-none"
                />
                {errorHandler(errors.email, 2, 60)}
              </label>
            </div>

          
          </div>

          <div className="flex justify-center mt-6">
          <button
    type="submit"
    disabled={submitting}
    className=" border text-xs 2xl:text-base font-medium bg-white text-black py-1 px-6"
    >
    {submitting ? `En cours` : `Modifier`}
    </button>
          </div>
        </form>
      </div>
    </div>
  );
}