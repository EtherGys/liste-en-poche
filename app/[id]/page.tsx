'use client'
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";


export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter()
    const params = useParams();
    const [listes, setListes] = useState<any[]>([]);
    const [user, setUser] = useState({
        email: "",
        firstname: "",
        lastname: "",
    });

    const fetchListes = async (id: any) => {
        const response = await fetch(`/api/possede`);
        const data = await response.json();
        setListes(data);
      };
    
    const fetchUserData = async () => {
        const response = await fetch(`/api/user/${params.id}`);
        const data = await response.json();  
        setUser({
            email: data.mail,
            firstname: data.prenom,
            lastname: data.nom
        });
        
        fetchListes(params.id);
    };
    
    const notify = () =>
        toast.success("Liste supprimée", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: { color: 'black' },
        });
    
    
    const deleteListe = async (id: string) => {
        try {
          const response = await fetch(`/api/user/${params.id}/delete_liste`, {
            method: "PATCH",
            body: JSON.stringify({
              id_liste: id,
            }),
          });
          if (response.ok) {
            notify()
            fetchUserData()
          }
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        fetchUserData();
    }, []);
    
    if (status === "unauthenticated") {
        router.push('/login')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-top bg-no-repeat sm:bg-cover sm:bg-center sm:bg-[url('/pictures/connexionIllus.png')] bg-[url('/pictures/IllusConnexion-Mobile.png')] bg-contain">
             <ToastContainer />
          {status === "authenticated" && (
            <main className="flex flex-col items-center justify-start sm:justify-center p-8 md:p-32">
              <div className="bg-white pb-6 sm:pb-8 lg:pb-20 w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl text-center sm:py-1 px-6 sm:px-8 lg:px-20 xl:px-60">
              
                <div className="space-y-2 tracking-wide justify-center">
                  <h2 className="text-sm md:text-lg font-semibold uppercase text-mediumGreen tracking-widest">
                    Mon profil
                  </h2>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <a href={`${params.id}/update`}>Editer</a>
                </button>
                <div className="flex justify-center">
                  <div className="border-mediumGreen border-t w-full my-2"></div>
                </div>
    
        
    
                <div className="container mx-auto py-4 mb-10">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-col ">
                      {/* Lastname */}
                      <div className="pr-4 py-4">
                        <div className="text-left">
                          <div className="text-xs font-playfair">Nom</div>
                          <div className="text-base font-medium">{user.lastname}</div>
                        </div>
                      </div>
                      {/* Firstname */}
                      <div className="pr-4 py-4">
                        <div className="text-left">
                          <div className="text-xs font-playfair text-darkGray">
                            Prénom
                          </div>
                          <div className="text-base font-medium">
                            {user.firstname}
                          </div>
                        </div>
                      </div>
                 
                      {/* Email */}
                      <div className="pr-4 py-4">
                        <div className="text-left">
                          <div className="text-xs font-playfair text-darkGray">
                            Email
                          </div>
                          <div className="text-base font-medium">{user.email}</div>
                        </div>
                      </div>
                    </div>
                   
                  </div>
                </div>
    
                
    
                <div className="space-y-2 tracking-wide justify-center mt-16">
                  <h2 className="text-sm md:text-lg font-semibold uppercase text-mediumGreen tracking-widest">
                    Mes listes
                  </h2>
                </div>
    
                <div className="flex justify-center">
                  <div className="border-mediumGreen border-t w-full my-2"></div>
                </div>
    
                <div className="container mx-auto py-4">
                  <div className="flex flex-col sm:flex-row flex-wrap items-start space-y-4 sm:space-y-0">
                    {listes.length > 0 && listes.map((liste: any) => (
                     
                      <div className="sm:w-1/2 flex items-start space-x-2 Space-y-2 pb-4" key={liste.id_liste}>
                        
                        <div className="flex flex-col items-start w-1/3 space-y-0">
                     
                          <a
                            onClick={() => deleteListe(liste.id_liste)}
                            className="w-full py-1 px-1 bg-black text-white text-xs flex items-center justify-center cursor-pointer group hover:bg-mediumGreen hover:text-white transition-all duration-300"
                          >
                           Supprimer la liste
                          </a>
                        </div>
    
                        
                        <div className="w-2/3 text-left text-darkGray">
                          <div className="text-base font-medium">
                            {liste.nom}
                          </div>
                          <div className="text-sm">
                            {liste.date_creation}
                          </div>
                        </div>
                      </div>
                      
                    ))}
                  </div>
                </div>
              </div>
            </main>
          )}
        </div>
      );
}
