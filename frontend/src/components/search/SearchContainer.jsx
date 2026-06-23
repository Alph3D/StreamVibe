"use client";
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";
import SearchActorItem from "./SearchActorItem";
import SearchMovieItem from "./SearchMovieItem";
import SearchForm from "./SearchForm";
import SearchMovieItemSkeleton from "./SearchMovieItemSkeleton";

const SearchContainer = ({ isOpen, setIsOpen }) => {
    const [show, setShow] = useState(isOpen);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (searchQuery) => {
        const cleanQuery = searchQuery?.trim();
        if (!cleanQuery) return;

        setLoading(true);
        console.log("🔍 Recherche lancée pour :", cleanQuery);

        try {
            // Nettoyage automatique des slashs pour éviter les URL brisées
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
            const response = await fetch(`${baseUrl}/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: cleanQuery }),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut: ${response.status}`);
            }

            const data = await response.json();
            console.log("📦 Données reçues du serveur :", data);

            // Sécurité : On s'adapte à la structure renvoyée par ton API (data.results OU data directement)
            const results = data.results || (Array.isArray(data) ? data : []);
            setSearchResults(results);
            
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.error("❌ Erreur lors de la recherche :", error);
        };
    };

    const handleClose = () => {
        setIsOpen(false);
        setQuery("");
        setSearchResults([]);
    };

    return (
        <SearchOverlay show={show} setShow={setShow} isOpen={isOpen}>
            <SearchForm query={query} setQuery={setQuery} handleClose={handleClose} handleSearch={handleSearch} />

            <div
                className="flex flex-col gap-6 mt-9 overflow-y-auto custom-scrollbar custom-scrollbar-sm pr-3 py-2 flex-1 border-y-2 border-y-c-black-20"
            >
                {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <SearchMovieItemSkeleton key={index} />
                    ))
                ) : !searchResults || searchResults.length === 0 ? (
                    query.trim() && !loading && (
                        <p className="text-c-grey-60 text-center py-4">Aucun résultat trouvé pour "{query}"</p>
                    )
                ) : (
                    searchResults.map((item) => {
                        // Sécurité si ton backend renvoie l'item directement sans structure item.type/item.data
                        const type = item.type || (item.category ? 'movie' : 'actor');
                        const itemData = item.data || item;

                        if (type === 'movie' || type === 'series') {
                            return <SearchMovieItem key={item._id} type={type} data={itemData} handleClose={handleClose} />;
                        } else if (type === 'actor' || type === 'director') {
                            return <SearchActorItem key={item._id} type={type} data={itemData} handleClose={handleClose} />;
                        }
                        return null;
                    })
                )}
            </div>
        </SearchOverlay>
    );
}

export default SearchContainer;