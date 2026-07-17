// components/ArtPlayer.jsx
"use client";

import { useEffect, useRef, useState } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';

export default function ArtPlayer({ 
    url, 
    poster = '', 
    subtitles = [],
    className = '',
    onReady = () => {},
    onPlay = () => {},
    onPause = () => {},
    onEnd = () => {},
}) {
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!containerRef.current || !url) return;

        // 🔥 Configuration ArtPlayer
        const config = {
            container: containerRef.current,
            url: url,
            poster: poster || '',
            volume: 0.6,
            isLive: false,
            muted: false,
            autoplay: false,
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
            theme: '#e50914', // Netflix red
            lang: 'fr',
            title: 'Lecteur vidéo',
            moreVideoAttr: {
                crossOrigin: 'anonymous',
            },
            // 🔥 Support HLS (.m3u8)
            customPlayback: {
                type: 'm3u8',
                play: function (video, videoUrl, artplayer) {
                    if (Hls.isSupported()) {
                        if (artplayer.hls) artplayer.hls.destroy();

                        const hls = new Hls({
                            enableWorker: true,
                            lowLatencyMode: true,
                        });
                        
                        hls.loadSource(videoUrl);
                        hls.attachMedia(video);
                        artplayer.hls = hls;

                        // 🔥 Menu de sélection de qualité
                        hls.on(Hls.Events.MANIFEST_PARSED, function () {
                            const levels = hls.levels;
                            if (levels && levels.length > 0) {
                                const qualityItems = levels.map((level, index) => ({
                                    html: level.height ? `${level.height}p` : `Level ${index}`,
                                    index: index,
                                }));

                                artplayer.setting.update({
                                    name: 'quality',
                                    html: 'Qualité',
                                    tooltip: 'Auto',
                                    selector: [
                                        { html: 'Auto', index: -1 },
                                        ...qualityItems,
                                    ],
                                    onSelect: function (item) {
                                        hls.currentLevel = item.index;
                                        return item.html;
                                    },
                                });
                            }
                        });
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = videoUrl;
                    }
                },
            },
        };

        // 🔥 Ajout des sous-titres si disponibles
        if (subtitles && subtitles.length > 0) {
            config.subtitle = {
                url: subtitles[0].url,
                type: 'srt',
                style: {
                    color: '#ffffff',
                    fontSize: '24px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                },
            };

            // 🔥 Sélecteur de sous-titres multiples
            if (subtitles.length > 1) {
                config.settings = [
                    {
                        width: 200,
                        html: 'Sous-titres',
                        tooltip: 'Choisir',
                        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6h16v12H4V6zm1 2v2h4V8H5zm14 0h-4v2h4V8zM5 12v2h4v-2H5zm14 0h-4v2h4v-2z"/></svg>',
                        selector: subtitles.map(sub => ({
                            default: sub.default || false,
                            html: sub.label || sub.name,
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
        }

        // 🔥 Événements
        config.events = {
            onReady: () => {
                setIsReady(true);
                console.log('✅ ArtPlayer prêt');
                onReady(playerRef.current);
            },
            onPlay: () => {
                console.log('▶️ Lecture');
                onPlay();
            },
            onPause: () => {
                console.log('⏸️ Pause');
                onPause();
            },
            onEnd: () => {
                console.log('⏹️ Fin');
                onEnd();
            },
            onError: (error) => {
                console.error('❌ Erreur ArtPlayer:', error);
            },
        };

        // 🔥 Création du lecteur
        try {
            const player = new Artplayer(config);
            playerRef.current = player;
        } catch (error) {
            console.error('❌ Erreur création ArtPlayer:', error);
        }

        // 🔥 Nettoyage
        return () => {
            if (playerRef.current) {
                try {
                    if (playerRef.current.hls) {
                        playerRef.current.hls.destroy();
                    }
                    playerRef.current.destroy(false);
                } catch (error) {
                    console.error('❌ Erreur destruction:', error);
                }
                playerRef.current = null;
            }
        };
    }, [url, poster, subtitles]);

    // 🔥 Mise à jour de l'URL
    useEffect(() => {
        if (playerRef.current && url) {
            try {
                // Vérifier si c'est un flux HLS
                if (url.includes('.m3u8') && playerRef.current.hls) {
                    playerRef.current.hls.loadSource(url);
                } else {
                    playerRef.current.switchUrl(url);
                }
            } catch (error) {
                console.error('❌ Erreur changement URL:', error);
            }
        }
    }, [url]);

    return (
        <div 
            ref={containerRef} 
            className={`${className} w-full h-full bg-black`}
        />
    );
}