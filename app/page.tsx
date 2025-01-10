"use client"; // Ajouté pour spécifier que ce composant est un composant client

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  // Afficher un message de chargement si le statut de la session est "loading"
  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
      {/* Titre */}
      <h1 className="text-4xl font-bold text-center text-red-500">
        Bienvenue sur Liste en Poche !
      </h1>

      {/* Logo dans un rond */}
      <Image
        src="/image.png"
        alt="Notre logo"
        width={150}
        height={150}
        className="rounded-full"
      />

      {/* Sous-titre */}
      <h2 className="text-2xl text-center text-gray-700">
        Liste en Poche, c'est quoi ?
      </h2>

      {/* Description */}
      <p className="text-center text-lg text-gray-600 max-w-xl px-4">
        Avec Liste en Poche, créez et conservez vos listes de courses en toute simplicité. 
        Organisez vos achats, partagez vos listes, et faites vos courses plus efficacement !
      </p>

      {/* Connexion ou va sur le profil */}
      <div className="flex justify-center gap-4">
        {session?.user ? (
          <Link href={`/${session?.user.id}/create`}>
            <button className="bg-red-500 text-white py-3 px-6 rounded-full hover:bg-red-600 transition duration-300">
              Commencer une nouvelle liste
            </button>
          </Link>
        ) : (
          <Link href="/login">
            <button className="bg-red-500 text-white py-3 px-6 rounded-full hover:bg-red-600 transition duration-300">
              Commencer
            </button>
          </Link>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-2">
        <p>&copy; 2025 Liste en Poche. ForEachAcademy. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
