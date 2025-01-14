interface Article {
    id_article: number;
    nom: string;
    acheter: boolean;
    qte: number;
}

interface Liste {
    id_liste: number;
    nom: string;
    articles: Article[];
}


export async function createList(liste: Liste) {
    const response = await fetch("/api/listes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(liste),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur inconnue.");
    }
    return response;
}


export async function assignListToUser(listId: string, userId: string) {
    await fetch("/api/possede", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_liste: listId, id_utilisateur: userId }),
    });
}

export async function createArticles(listId: string, articles: any[]) {
    const requests = articles.map((article) =>
        fetch("/api/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: article.nom, acheter: article.acheter }),
        })
    );
    await Promise.all(requests);
}

export async function updateList(liste: Liste) {
    const response = await fetch(`/api/listes/${liste.id_liste}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(liste),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur inconnue.");
    }
    return response;
}
