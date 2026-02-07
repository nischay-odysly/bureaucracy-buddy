import { useState, useRef, useCallback } from "react";
import { textToSpeech, playAudio, type VoiceType } from "@/services/api";

const STORAGE_KEY = "bureaucracy_buddy_autoplay";

export function useAutoPlayTTS() {
    const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(() => {
        if (typeof window === "undefined") return true;
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    // Cache: text -> audio blob
    const cacheRef = useRef<Map<string, Blob>>(new Map());

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setIsPlaying(false);
    }, []);

    const play = useCallback(async (text: string, voice: VoiceType = "english_female"): Promise<Blob | null> => {
        stop();

        if (!text) return null;

        try {
            setIsLoading(true);

            // Check cache first
            let blob = cacheRef.current.get(text);

            if (!blob) {
                // Fetch from API (non-streaming for reliability)
                blob = await textToSpeech(text, voice);
                cacheRef.current.set(text, blob);
            }

            setIsLoading(false);
            setIsPlaying(true);

            const audio = playAudio(blob);
            audioRef.current = audio;

            audio.onended = () => {
                setIsPlaying(false);
                audioRef.current = null;
            };

            audio.onerror = () => {
                console.error("Audio playback error");
                setIsPlaying(false);
                audioRef.current = null;
            };

            return blob;
        } catch (error) {
            console.error("TTS failed:", error);
            setIsLoading(false);
            setIsPlaying(false);
            return null;
        }
    }, [stop]);

    const toggleAutoPlay = useCallback(() => {
        setIsAutoPlayEnabled((prev: boolean) => {
            const next = !prev;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    // Get cached blob for a text (for sharing with ResultCards)
    const getCachedBlob = useCallback((text: string): Blob | null => {
        return cacheRef.current.get(text) || null;
    }, []);

    // Set a blob in cache (e.g., if ResultCards fetches it first)
    const setCachedBlob = useCallback((text: string, blob: Blob) => {
        cacheRef.current.set(text, blob);
    }, []);

    return {
        isAutoPlayEnabled,
        toggleAutoPlay,
        isPlaying,
        isLoading,
        play,
        stop,
        getCachedBlob,
        setCachedBlob,
    };
}
