// components/singlePage/ArtPlayer.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";

const ArtPlayer = ({ 
    src, 
    poster = "", 
    title = "Lecteur vidéo",
    subtitleUrl = "",
    subtitles = [],
    quality = [],
    autoplay = false,
    isLive = false,
    theme = "#e50914",
    language = "fr",
    onReady = () => {},
    onPlay = () => {},
    onPause = () => {},
    onEnd = () => {},
}) => {
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!containerRef.current || !src) return;

        // 🔥 Configuration de base
        const config = {
            container: containerRef.current,
            url: src,
            poster: poster || "",
            volume: 0.5,
            isLive: isLive,
            muted: false,
            autoplay: autoplay,
            pip: true,
            autoSize: true,
            autoMini: true,
            screenshot: true,
            setting: true,
            loop: false,
            flip: true,
            playbackRate: true,
            aspectRatio: true,
            fullscreen: true,
            fullscreenWeb: true,
            subtitleOffset: true,
            miniProgressBar: true,
            mutex: true,
            backdrop: true,
            playsInline: true,
            autoPlayback: true,
            airplay: true,
            theme: theme,
            lang: language,
            title: title || "Lecteur vidéo",
            moreVideoAttr: {
                crossOrigin: 'anonymous',
            },
        };

        // 🔥 Ajouter les sous-titres SEULEMENT si une URL est fournie
        if (subtitleUrl && subtitleUrl.trim() !== "") {
            config.subtitle = {
                url: subtitleUrl,
                type: 'srt',
                style: {
                    color: '#fe9200',
                    fontSize: '20px',
                },
                encoding: 'utf-8',
            };
        }

        // 🔥 Ajouter les qualités SEULEMENT si fournies
        if (quality && quality.length > 0) {
            config.quality = quality;
        } else {
            // Qualité par défaut
            config.quality = [
                {
                    default: true,
                    html: 'HD',
                    url: src,
                }
            ];
        }

        // 🔥 Ajouter les sous-titres multiples SEULEMENT si fournis
        if (subtitles && subtitles.length > 0) {
            config.settings = [
                {
                    width: 200,
                    html: 'Sous-titres',
                    tooltip: 'Choisir',
                    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6h16v12H4V6zm1 2v2h4V8H5zm14 0h-4v2h4V8zM5 12v2h4v-2H5zm14 0h-4v2h4v-2z"/></svg>',
                    selector: subtitles.map(sub => ({
                        default: sub.default || false,
                        html: sub.html || sub.name,
                        url: sub.url,
                    })),
                    onSelect(item) {
                        if (playerRef.current) {
                            playerRef.current.subtitle.switch(item.url, {
                                name: item.html,
                            });
                        }
                        return item.html;
                    },
                },
            ];
        }

        // 🔥 Menu contextuel
        config.contextmenu = [
            {
                html: '📺 ' + (title || "Vidéo"),
                click(contextmenu) {
                    console.info('Titre:', title);
                    contextmenu.show = false;
                },
            },
            {
                html: '🔊 Langue: ' + language.toUpperCase(),
                click(contextmenu) {
                    console.info('Langue:', language);
                    contextmenu.show = false;
                },
            },
        ];

        // 🔥 Événements
        config.events = {
            onReady: () => {
                setIsReady(true);
                console.log('🎬 ArtPlayer prêt !');
                onReady(playerRef.current);
            },
            onPlay: () => {
                console.log('▶️ Lecture démarrée');
                onPlay();
            },
            onPause: () => {
                console.log('⏸️ Lecture en pause');
                onPause();
            },
            onEnd: () => {
                console.log('⏹️ Vidéo terminée');
                onEnd();
            },
            onError: (error) => {
                console.error('❌ Erreur ArtPlayer:', error);
            },
        };

        // 🔥 Créer le lecteur
        try {
            const player = new Artplayer(config);
            playerRef.current = player;
        } catch (error) {
            console.error('❌ Erreur de création du lecteur:', error);
        }

        // 🔥 Nettoyage
        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (error) {
                    console.error('❌ Erreur de destruction:', error);
                }
                playerRef.current = null;
            }
        };
    }, [src, poster, title, subtitleUrl, subtitles, quality, autoplay, isLive, theme, language, onReady, onPlay, onPause, onEnd]);

    // 🔥 Mettre à jour la vidéo si la source change
    useEffect(() => {
        if (playerRef.current && src) {
            try {
                playerRef.current.switchUrl(src);
            } catch (error) {
                console.error('❌ Erreur de changement de source:', error);
            }
        }
    }, [src]);

    // 🔥 Mettre à jour les sous-titres si changés
    useEffect(() => {
        if (playerRef.current && subtitleUrl && subtitleUrl.trim() !== "") {
            try {
                playerRef.current.subtitle.switch(subtitleUrl, {
                    name: 'Sous-titres',
                });
            } catch (error) {
                console.error('❌ Erreur de changement de sous-titres:', error);
            }
        }
    }, [subtitleUrl]);

    return (
        <div className="w-full aspect-video overflow-hidden rounded-xl border border-gray-700/50 bg-black shadow-2xl">
            <div ref={containerRef} className="artplayer-app w-full h-full" />
        </div>
    );
};

export default ArtPlayer;