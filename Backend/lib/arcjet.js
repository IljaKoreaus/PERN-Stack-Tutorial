import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";

// initialize arcjet
export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics:["ip.src"],
    rules: [
        // Shield protects your app from common attacks e.g. SQL Injection XSS, CSRF attacks
        shield({mode:"LIVE"}),

        // Blocks all bots except search engines
        detectBot({
            mode:"LIVE",
            allow:[
                "CATEGORY:SEARCH_ENGINE"
            ]
        }),
        
        // Rate limiting
        tokenBucket({
            mode:"LIVE",
            refillRate: 30,
            interval: 5,
            capacity: 20
        })
    ]
});