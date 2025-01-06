import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Bienvenue sur Liste en Poche !</h1>
      <Image src="/image.png" alt="Notre logo" width={100} height={100}/>
      <h2>Liste en Poche, à quoi ça sert ?</h2>

      <p>Avec Liste en Poche, créer et conserver vos listes de courses </p>
    </div>
  );
}
