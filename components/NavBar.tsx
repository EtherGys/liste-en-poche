"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import Image from "next/image";

export function NavBar() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);

  return (
    <>
      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #333;
          padding: 15px 30px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .logo {
          color: white;
          font-size: 24px;
          font-weight: bold;
        }

        .nav-links {
          display: flex;
          gap: 20px;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          font-size: 18px;
          padding: 10px;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .nav-links a:hover {
          background-color: #555;
        }

        .nav-links button {
          background: transparent;
          color: white;
          border: 2px solid white;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .nav-links button:hover {
          background-color: #555;
          color: white;
        }
      `}</style>

      <nav>
        <div className="logo">
			<Link href="/">LOGO LA</Link>
		</div>

        {/* Navigation pour l'utilisateur connecté */}
        <div className="nav-links">
          {session?.user ? (
            <>
              <Link href="/">Créer une liste</Link>
              <Link href="/">Toutes mes listes</Link>
              <Link href="/">Mon Profil</Link>
              <button onClick={() => signOut()}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link href="/login">Connexion</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
