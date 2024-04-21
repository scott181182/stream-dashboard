import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { AccessToken } from 'livekit-server-sdk';
import { z } from "zod";

import { Config, loadConfiguration } from "./config";



/** Token expiration time, in seconds. */
const TOKEN_EXPIRATION = 60 * 60 * 24;

const LoginSchema = z.object({
    name: z.string().min(3),
    password: z.string()
});



function log(message: string) {
    const now = new Date();
    console.log(`[${now.toISOString()}] ${message}`);
}
function getLivekitAccessToken(config: Config, identity: string) {
    const at = new AccessToken(config.livekitApiKey, config.livekitApiSecret, {
        identity,
        ttl: TOKEN_EXPIRATION
    });
    at.addGrant({ roomJoin: true, room: config.livekitRoom, canSubscribe: true });

    return at.toJwt();
}


function main() {
    const config = loadConfiguration();
    const app = new Hono();

    app.post("/api/login", zValidator("form", LoginSchema), async (c) => {
        const data = c.req.valid("form");
        log(`Login request from '${data.name}'`)

        if(data.password !== config.password) {
            throw new HTTPException(403, { message: "Incorrect Password" });
        }

        const token = await getLivekitAccessToken(config, data.name);

        setCookie(c, "LiveKitToken", token, {
            maxAge: TOKEN_EXPIRATION,
            httpOnly: false,
        });
        return c.redirect("/streams.html");
    })    

    app.use("/*", serveStatic({
        root: "./public"
    }))

    // defaults to 0.0.0.0:$PORT
    log("Starting server...");
    Bun.serve({
        fetch: app.fetch,
    });
    log("Server started!");
}
main();