"use client";

import { SearchSvg } from "@/assets/Svgs";

const SearchForm = ({ query, setQuery, handleClose, handleSearch }) => {

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        // Lance la recherche dès qu'il y a plus de 2 caractères tapés
        if (val.trim().length > 2) {
            handleSearch(val);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="flex items-center">
            <div
                className="bg-c-black-12 border border-c-black-20 rounded-xl relative overflow-hidden w-full"
            >
                <button
                    className="h-full bg-c-black-15 absolute z-10 left-0 aspect-square flex justify-center items-center focus:outline-none"
                    type="submit"
                >
                    <SearchSvg className="3xl:w-[2.4rem] 3xl:h-[2.4rem]" />
                </button>
                <input
                    type="text"
                    className="w-full bg-transparent py-3 ml-[4.3rem] tracking-wide text-super-sm text-c-grey-70 placeholder:text-c-grey-70/70 focus:outline-none"
                    placeholder="Search for a movie, tv show, person..."
                    value={query}
                    onChange={handleChange} // Utilisation de la nouvelle fonction
                />
            </div>
            <span
                className="font-medium text-c-grey-60 cursor-pointer py-2 px-1 ml-2"
                onClick={handleClose}
            >Close</span>
        </form>
    );
}

export default SearchForm;