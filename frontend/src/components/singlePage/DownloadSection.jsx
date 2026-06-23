import DownloadItem from "./DownloadItem";

const DownloadSection = ({ files, seriesTitle, moviePage, season, episode }) => {
    return (
        <section
            className="bg-c-black-10 border border-c-black-15 xl:p-9 md:px-5 md:py-5 px-3.5 py-3.5 rounded-2.5xl"
        >
            <h4
                className="text-white md:text-xl text-base font-medium lg:mb-8 md:mb-5 mb-6"
            >
                Download Links
            </h4>

            {/* Sécurité : utilisation de files?.map pour éviter le crash si files est indéfini */}
            {files && files.length > 0 ? (
                files.map((file, index) => (
                    <DownloadItem 
                        key={index} 
                        moviePage 
                        quality={file.quality} 
                        size={file.size || '1.2 GB'} // Utilise la taille réelle du fichier si elle existe
                        url={file.url} 
                        seriesTitle={seriesTitle} 
                        season={season} 
                        episode={episode} 
                    />
                ))
            ) : (
                <p className="text-c-grey-60 text-sm italic">
                    No download links available for this title yet.
                </p>
            )}

        </section>
    );
}

export default DownloadSection;