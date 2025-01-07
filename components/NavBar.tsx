"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import Image from "next/image";

export function NavBar() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<any>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);

  const generalLinkstyle = "p-4 hover:bg-[#4F4141]";
  const selectedLinkstyle =
    "p-4 hover:bg-[#4F4141] bg-gray-300 text-gray-700 hover:text-gray-500 font-semibold border-b-4 border-[#E7A100]";

  return (
    <div className="font-roboto">
      {/* Desktop Navigation */}
      <nav className="bg-red-500 p-4 sticky top-0 z-10 md:flex hidden">
        <div className="flex flex-wrap justify-between w-screen items-center mx-auto max-w-screen-xl">
          <a href="/" className="text-white flex items-center">
            <Image
              className="w-6 h-6 mt-1 mr-2"
              src="/image.png"
              alt="Logo"
              width={24}
              height={24}
            />
            <p className="self-center text-2xl font-semibold">Liste en Poche</p>
          </a>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <Link href="/">
                  <button className="text-white text-lg px-4 py-2 rounded">
                    Créer une nouvelle liste
                  </button>
                </Link>
                <Link href="/">
                  <button className="text-white text-lg px-4 py-2 rounded">
                    Mon Profil
                  </button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-white text-red-400 border-2 border-white px-6 py-2 rounded-full hover:bg-red-600 hover:text-white font-bold">
                  Déconnexion
                </button>
              </>
            ) : (
              <Link href="/login">
                <button className="bg-white text-red-400 border-2 border-white px-6 py-2 rounded-full hover:bg-red-600 hover:text-white font-bold">
                  Connexion
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex fixed z-40 w-screen">
        {/* Burger Menu */}
        <div className="flex justify-between w-full bg-red-500 p-4">
          <a href="/" className="text-white flex items-center">
            <Image
              className="w-6 h-6 mt-1 mr-2"
              src="/image.png"
              alt="Logo"
              width={24}
              height={24}
            />
            <p className="self-center text-2xl font-semibold">Liste en Poche</p>
          </a>
          <div
            onClick={() => setToggleDropdown((prev) => !prev)}
            className="mr-4 my-auto w-6 h-6 z-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
        </div>

        {/* Dropdown Menu */}
        {toggleDropdown && (
          <div className="absolute right-0 top-full rounded-bl-lg w-[50%] p-5 bg-red-500 min-w-[210px] flex flex-col gap-2 justify-end items-end text-white">
            <Link href="/" className="my-4 text-lg" onClick={() => setToggleDropdown(false)}>
              Accueil
            </Link>
            <Link
              href="/new-list"
              className="my-4 text-lg"
              onClick={() => setToggleDropdown(false)}
            >
              Nouvelle liste
            </Link>
            <Link
              href="/profil"
              className="my-4 text-lg"
              onClick={() => setToggleDropdown(false)}
            >
              Mon profil
            </Link>
            {session?.user ? (
              <button
                onClick={() => signOut()}
                className="bg-white text-red-400 border-2 border-white px-6 py-2 rounded-full hover:bg-red-600 hover:text-white font-bold"
              >
                Déconnexion
              </button>
            ) : (
              <Link href="/login">
                <button className="bg-white text-red-400 border-2 border-white px-6 py-2 rounded-full hover:bg-red-600 hover:text-white font-bold">
                  Connexion
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
