interface Article {
    id: number;
    nom: string;
    acheter: boolean;
}

interface Liste {
    id: number;
    nom: string;
    articles: Article[];
}


export async function createList(liste : Liste) {
    const response = await fetch("/api/listes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liste}),
    });
    return response.json();
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
