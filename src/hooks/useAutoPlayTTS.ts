import { useState, useRef, useCallback, useEffect } from "react";
import { textToSpeechChunked, type VoiceType } from "@/services/api";
import { TTSPlayer } from "@/utils/TTSPlayer";

const STORAGE_KEY = "bureaucracy_buddy_autoplay";

export function useAutoPlayTTS() {
    const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(() => {
        if (typeof window === "undefined") return true;
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Use a ref to keep track of the player instance
    const playerRef = useRef<TTSPlayer | null>(null);

    // Initialize player on mount/unmount
    useEffect(() => {
        // Initialize player
        playerRef.current = new TTSPlayer(
            () => {
                // onPlaybackEnd
                setIsPlaying(false);
            },
            (error) => {
                // onError
                console.error("TTS output error", error);
                setIsPlaying(false);
                setIsLoading(false);
            }
        );

        return () => {
            playerRef.current?.stop();
        };
    }, []);

    const stop = useCallback(() => {
        playerRef.current?.stop();
        setIsPlaying(false);
        setIsLoading(false);
    }, []);

    const play = useCallback(async (text: string, voice: VoiceType = "english_female") => {
        // Stop any current playback
        stop();

        if (!text) return;

        try {
            setIsLoading(true);
            setIsPlaying(true); // Optimistically set playing

            // Start streaming request
            const response = await textToSpeechChunked(text, voice);

            setIsLoading(false); // Valid response received, now playing/buffering

            // Hand over to player
            if (playerRef.current) {
                await playerRef.current.playStream(response);
            }
        } catch (error) {
            console.error("TTS failed:", error);
            setIsLoading(false);
            setIsPlaying(false);
        }
    }, [stop]);

    const toggleAutoPlay = useCallback(() => {
        setIsAutoPlayEnabled((prev: boolean) => {
            const next = !prev;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    return {
        isAutoPlayEnabled,
        toggleAutoPlay,
        isPlaying,
        isLoading,
        play,
        stop,
    };
}
