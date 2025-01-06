"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import NavigationLink from "../NavigationLink";


export default function LoginForm() {
  const [error, setError] = useState(false)
  const [user, setUser] = useState({
    email: '',
    password: '',
  })
  const { data: session, status } = useSession()
  const router = useRouter();

  const { register,
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
        return;
      }

      router.push(``);
    } catch (error) {
      console.log(error);
    }
  }


  function errorHandler(errorInput: any, minNum: number, maxNum: number) {
    return (
      <>
        {errorInput && errorInput.type === "required" && (
          <p className='ml-2 text-red-600'>plop</p>
        )}
      </>
    )
  };

return (
 <section className="min-h-screen flex items-center justify-center bg-top bg-no-repeat sm:bg-cover sm:bg-center sm:bg-[url('/pictures/connexionIllus.png')] bg-[url('/pictures/IllusConnexion-Mobile.png')] bg-contain">
  <div className="mx-auto px-10 md:px-40 2xl:px-80 2xl:py-32 fixed sm:relative top-0 mt-12 sm:mt-4 bg-white pb-6 pt-6 sm:pt-8 sm:pb-8 text-center sm:mx-auto">
  <div className='flex justify-center mt-8 sm:mt-10 sm:mt-4 text-2xl sm:text-3xl font-playfair text-center text-darkGrey'>
     Connexion
    </div>
    <div className="flex justify-center mt-4">
      <NavigationLink className="text-sm text-right" href={'/'}>
        Nouveay compte
        <span className="underline text-mediumGreen">
          Inscription
        </span>
      </NavigationLink>
    </div>
   <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className='mt-8 sm:mt-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col gap-7 mx-auto'>
      {/* Email */}
      <label className="block mb-2 text-sm font-medium dark:text-darkGray" htmlFor="email">
        <input
          type="email"
          value={user.email}
          {...register("email", {
            required: true, minLength: 2, maxLength: 150, onChange: (e) => setUser({
              ...user, email: e.target.value
            })
          })}
          name="email"
          id="email"
          placeholder="Email"
          required
          className='mt-2 bg-transparent border-0 border-b border-darkGray dark:text-darkGray text-sm 2xl:text-base placeholder-darkGray block w-full p-1 dark:border-darkGrey dark:text-darkGray dark:placeholder-transparent focus:ring-0 focus:border-darkGrey font-medium mx-auto'
        />
        {errorHandler(errors.email, 2, 150)}
      </label>

      {/* Password */}
      <label htmlFor="password">
        <input
          type="password"
          value={user.password}
          required
          {...register("password", {
            required: true, minLength: 2, maxLength: 30, onChange: (e) => setUser({
              ...user, password: e.target.value
            })
          })}
          name="password"
          id="password"
          placeholder="Mot de passe"
          className='mt-2 bg-transparent border-0 border-b border-darkGray text-darkGray text-sm 2xl:text-base placeholder-darkGray block w-full p-1 dark:border-darkGrey dark:text-darkGray dark:placeholder-transparent focus:ring-0 focus:border-darkGrey font-medium w-full mx-auto'
        ></input>
        {errorHandler(errors.password, 2, 30)}
      </label>
      {error && <p className="text-red-500 text-xs">
       N'existe pas
      </p>}

      {/* submit button */}
      <div className='flex flex-col justify-center items-center mx-3 mt-10 sm:mt-3 gap-4 mb-5'>
        <button type='submit' className='text-xs 2xl:text-base font-light bg-black text-white py-1 px-6'>
          Connexion
        </button>
      </div>
    </form>
  </div>
</section>



  );
}