/**
 * TTS Player for Chunked Streaming
 * 
 * Handles the custom multipart format: {length}:{json_metadata}:{audio_bytes}
 * Plays audio chunks sequentially as they arrive.
 */

export interface TTSChunkMetadata {
    chunk_index: number;
    total_chunks: number;
    is_last: boolean;
    audio_size: number;
}

export class TTSPlayer {
    private audioContext: AudioContext | null = null;
    private isPlaying: boolean = false;
    private queue: AudioBuffer[] = [];
    private processingQueue: boolean = false;
    private activeSources: AudioBufferSourceNode[] = []; // Track all scheduled sources
    private nextStartTime: number = 0;
    private onPlaybackEnd: () => void;
    private onError: (error: Error) => void;

    constructor(onPlaybackEnd: () => void = () => { }, onError: (error: Error) => void = console.error) {
        this.onPlaybackEnd = onPlaybackEnd;
        this.onError = onError;

        // Initialize AudioContext on user interaction if possible, 
        // but often needs to be done explicitly in a click handler first.
        if (typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            this.audioContext = new AudioContextClass();
        }
    }

    /**
     * Initialize AudioContext if suspended (browser autoplay policy)
     */
    async init() {
        if (!this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    /**
     * Stop playback and clear queue
     */
    stop() {
        this.isPlaying = false;
        this.queue = [];

        // Stop all active sources
        this.activeSources.forEach(source => {
            try {
                source.stop();
                source.disconnect();
            } catch (e) {
                // Ignore errors if already stopped
            }
        });
        this.activeSources = [];
        this.nextStartTime = 0;

        // Reset processed time to now to avoid scheduling lag if restarted
        if (this.audioContext) {
            this.nextStartTime = this.audioContext.currentTime;
        }
    }

    /**
     * Process the stream from the fetch response
     */
    async playStream(response: Response) {
        if (!response.body) throw new Error("No response body");
        if (!this.audioContext) throw new Error("AudioContext not initialized");

        this.isPlaying = true;
        await this.init(); // Ensure context is running

        // Reset start time relative to current time
        this.nextStartTime = this.audioContext.currentTime;

        const reader = response.body.getReader();
        let buffer: Uint8Array = new Uint8Array(0);

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                if (!this.isPlaying) {
                    reader.cancel();
                    break;
                }

                // Append new data to buffer
                const newBuffer = new Uint8Array(buffer.length + value.length);
                newBuffer.set(buffer);
                newBuffer.set(value, buffer.length);
                buffer = newBuffer;

                // Try to process chunks from buffer
                buffer = await this.processBuffer(buffer);
            }
        } catch (error) {
            if (this.isPlaying) { // Only report error if we didn't intentionally stop
                this.onError(error as Error);
            }
            this.stop();
        }
    }

    /**
     * Parse chunks from the raw byte buffer
     * Format: {length}:{json}:{audio}
     * Returns: Remaining buffer
     */
    private async processBuffer(buffer: Uint8Array): Promise<Uint8Array> {
        let offset = 0;

        while (offset < buffer.length) {
            // 1. Read length of JSON metadata
            // Look for the first colon ':'
            const colonIndex = buffer.indexOf(58, offset); // 58 is ':'
            if (colonIndex === -1) break; // Incomplete length header

            const lengthStr = new TextDecoder().decode(buffer.slice(offset, colonIndex));
            const jsonStatsLength = parseInt(lengthStr, 10);

            if (isNaN(jsonStatsLength)) {
                console.error("Invalid chunk format: length is NaN");
                return buffer.slice(offset);
            }

            // 2. Check if we have enough data for JSON + 2nd colon
            const jsonStart = colonIndex + 1;
            const jsonEnd = jsonStart + jsonStatsLength;

            if (buffer.length < jsonEnd + 1) break; // Not enough data for JSON + colon

            // Verify second colon
            if (buffer[jsonEnd] !== 58) {
                console.error("Invalid chunk format: missing second colon");
                break;
            }

            // 3. Parse JSON
            const jsonBytes = buffer.slice(jsonStart, jsonEnd);
            let metadata: TTSChunkMetadata;
            try {
                metadata = JSON.parse(new TextDecoder().decode(jsonBytes));
            } catch (e) {
                console.error("Failed to parse chunk metadata", e);
                break;
            }

            // 4. Check if we have enough data for Audio
            const audioStart = jsonEnd + 1;
            const audioEnd = audioStart + metadata.audio_size;

            if (buffer.length < audioEnd) break; // Not enough data for audio

            // 5. Extract Audio
            const audioBytes = buffer.slice(audioStart, audioEnd);

            // 6. Decode and Queue Audio
            await this.decodeAndQueue(audioBytes.buffer);

            // Move offset to next chunk
            offset = audioEnd;
        }

        // Return remaining unprocessed bytes
        return buffer.slice(offset);
    }

    private async decodeAndQueue(audioData: ArrayBuffer) {
        if (!this.audioContext || !this.isPlaying) return;

        try {
            const audioBuffer = await this.audioContext.decodeAudioData(audioData);
            this.queue.push(audioBuffer);
            this.scheduler();
        } catch (e) {
            console.error("Error decoding audio chunk", e);
        }
    }

    private scheduler() {
        if (!this.audioContext) return;

        // Reset scheduling time if it fell behind
        if (this.nextStartTime < this.audioContext.currentTime) {
            this.nextStartTime = this.audioContext.currentTime;
        }

        while (this.queue.length > 0) {
            const buffer = this.queue.shift();
            if (!buffer) break;

            this.playBuffer(buffer, this.nextStartTime);
            this.nextStartTime += buffer.duration;
        }
    }

    private playBuffer(buffer: AudioBuffer, startTime: number) {
        if (!this.audioContext) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);

        // Track this source
        this.activeSources.push(source);

        source.onended = () => {
            // Remove from active sources
            this.activeSources = this.activeSources.filter(s => s !== source);

            // Check if this was the last one and queue is empty
            if (this.activeSources.length === 0 && this.queue.length === 0 && !this.isPlaying) {
                // Playback finished naturally (ignoring simple paused state for now)
            }
        };

        source.start(startTime);
    }
}
