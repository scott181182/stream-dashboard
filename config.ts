


function getEnvVarOrThrow(key: string): string {
    const value = Bun.env[key];
    if(!value) {
        throw new Error(`Expected $${key} to be defined`);
    }
    return value;
}

export function loadConfiguration() {
    const livekitUrl = getEnvVarOrThrow("LIVEKIT_URL");
    const livekitApiKey = getEnvVarOrThrow("LIVEKIT_API_KEY");
    const livekitApiSecret = getEnvVarOrThrow("LIVEKIT_API_SECRET");

    const livekitRoom = getEnvVarOrThrow("LIVEKIT_ROOM");
    const password = getEnvVarOrThrow("LIVEKIT_ROOM_PASSWORD");

    return {
        livekitUrl, livekitApiKey, livekitApiSecret,
        livekitRoom, password
    };
}
export type Config = ReturnType<typeof loadConfiguration>;
