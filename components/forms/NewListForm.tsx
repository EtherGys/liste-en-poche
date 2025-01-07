"use client";
import { useState } from "react";
import { SubmitHandler, useForm, FieldError } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import NavigationLink from "../NavigationLink";




interface NewListForm {
  liste: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [liste, setListe] = useState<string>("");
  const [newListId, setNewListId] = useState<string>("");
  const [articles, setArticles] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const params = useParams()
  console.log(params);
  
  const inputArr = [
    {
      type: "text",
      id: 1,
      value: ""
    }
  ];
  
  const [arr, setArr] = useState(inputArr);
  
  const addInput = () => {
    setArr((s: any) => {
      const lastId = s[s.length - 1].id;
      return [
        ...s,
        {
          type: "text",
          value: ""
        }
      ];
    });
  };
  
  const handleChange = (e: any) => {
    e.preventDefault();
    
    const index = e.target.id;
    setArr(s => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;
      
      setArticles(newArr);
      return articles;
    });
  };
  
  
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
  } = useForm<NewListForm>();
  
  function errorHandler(
    errorInput: FieldError | undefined,
    minNum: number,
    maxNum: number
  ) {
    return (
      <>
      {errorInput?.type === "required" && (
        <p className="ml-2  text-xs font-light">
        Le mot de passe est obligatoire
        </p>
      )}
      {errorInput?.type === "minLength" && (
        <p className="ml-2  text-xs font-light">
        Le mot de passe doit contenir au moins {minNum} caractères
        </p>
      )}
      {errorInput?.type === "maxLength" && (
        <p className="ml-2  text-xs font-light">
        Le mot de passe doit contenir au maximum {maxNum} caractères
        </p>
      )}
      </>
    );
  }

 const createArticles = async() => {
  const newArticles: any[] = [];
  articles.forEach(async article => {
     const response = fetch("/api/articles", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       nom: article.nom,
       acheter: article.acheter
     }),
   });
   newArticles.push(response)
   await createContiens(newListId, article)
 });

 return newArticles
 }

 const createContiens = async (idListe: string, article: any) => {
  const response = await fetch("/api/contiens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_liste: idListe,
      id_article: article.id_article,
      qte: article.qte,
    }),
  }).then(res => res.json());
 }

const assigneToUser = async () => {
  const response = await fetch("/api/possede", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_liste: newListId,
      id_utilisateur: params.id,
    }),
  }).then(res => res.json());
}

  async function createListe() {
    setSubmitting(true);
    try {
      const responseListe = await fetch("/api/listes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: liste,
          createur: params.id
        }),
      }).then(res => res.json());

      setNewListId(responseListe.id_liste)

      await assigneToUser()

      const newArticles = await createArticles();

      if (responseListe && newArticles.length > 0) {
        
      }
      setSubmitting(false);
    } catch (error) {
      console.log(error);
    } finally {
      notify();
      setTimeout(() => {
        router.push(`/${params.id}`);
      }, 5000);
    }
  }
  
  const onSubmit: SubmitHandler<any> = () => {
    createListe();
  };
  
  console.log(articles);
  
  return (
    < >
    <ToastContainer />
    <div className=" mx-auto mt-4 px-8 sm:fixed md:relative top-0 md:mt-0  pb-6 pt-6 sm:pt-6 sm:pb-6 w-9/12 sm:w-full max-w-xs sm:max-w-lg lg:max-w-xl 2xl:max-w-4xl text-center mx-4">
    <div className="flex justify-center mt-8 sm:mt-10 sm:mt-4 text-xl sm:text-2xl font-playfair text-center ">
    Créer une nouvelle liste
    </div>    
    
    
    <form
    onSubmit={handleSubmit(onSubmit)}
    noValidate
    className="mt-8 sm:mt-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col gap-7 mx-auto"
    >
    {/* Nom liste */}
    <label
    className="block -mb-2 sm:mb-2 text-sm font-medium "
    htmlFor="liste"
    >
    <input
    type="text"
    value={liste}
    {...register("liste", {
      required: true,
      minLength: 2,
      maxLength: 200,
      onChange: (e: any) =>
        setListe(
        e.target.value,
      ),
    })}
    name="liste"
    id="liste"
    placeholder="Nom de la nouvelle liste"
    required
    className="bg-transparent border-0 border-b   text-sm 2xl:text-base font-normal  block w-full p-1 focus:ring-0 focus: text-lg font-medium"
    ></input>
    {errorHandler(errors.liste, 2, 200)}
    </label>
    
    
    {/* Articles */}
    <div className=''>
    <span className='font-satoshi font-semibold text-base text-gray-700 mr-6'>
    Articles
    </span>
    
    <button type='button' className='border border-gray-300 w-32 h-12 rounded-full' onClick={addInput}>Ajouter +</button>
    <div className="mt-8">
    
    {arr.map((item, i) => {
      return (
        <div className="border rounded-md m-2 p-2">
        <input
        onChange={handleChange}
        value={item.value}
        className="w-[50%] mt-6 bg-transparent border-0 border-b   text-sm 2xl:text-base font-normal  block w-full p-1 focus:ring-0 focus: text-lg font-medium"
        placeholder="Nom de l'article"
        key={i}
        id={i.toString()}
        type={item.type}
        size={20}
        />
        <div className="flex flex-row mt-4">
        <div className="flex items-center mb-4">
        <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Acheté</label>
        </div>
        
        
        <label  className=" px-4 pt-1 text-sm">Quantité</label>
        <input type="number" id="number-input" aria-describedby="helper-text-explanation" className=" w-[15%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" required />
        </div>
        
        
        </div>
      );
    })}
    </div>
    </div>
    
    
    {/* submit button */}
    <div className="flex justify-center mt-6">
    <button
    type="submit"
    disabled={submitting}
    className=" border text-xs 2xl:text-base font-medium bg-white text-black py-1 px-6"
    >
    {submitting ? `En cours` : `Créer`}
    </button>
    </div>
    </form>
    </div>
    </>
  );
}