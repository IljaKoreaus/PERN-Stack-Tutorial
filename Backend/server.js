import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"

import productRoutes from "./routes/productRoutes.js";
import {sql} from "./config/db.js";
import {aj} from "./lib/arcjet.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json()); // Extraction of JSON data
app.use(cors()); // CORS Errors in client
app.use(helmet({
    contentSecurityPolicy: false
})); // Helmet Application Security; Middelware; HTTPS Headers
app.use(morgan("dev")); // Logs Requests

// Implementing arcjet (rate limiting, bot detection & shield)
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1 // specifies that each request consumes 1 token
        })

        if (decision.isDenied()) {
            
            if (decision.reason.isRateLimit()) {

                res.status(429).json({error: "Too Many Requests"});

            } else if (decision.reason.isBot()) {

                res.status(403).json({error: "Bot access denied"});

            } else {

                res.status(403).json({error: "Forbidden"});
            }
            return;
        }

        // Checking for spoofed bots
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({error: "Spoofed bot detected"});
            return;
        }

        next();
    } catch (error) {
        console.log("Arcjet Error", error);
        next(error);
    }
})

app.use("/api/products", productRoutes);

if (process.env.NODE_ENV==="production") {
    // Serve React App
    app.use(express.static(path.join(__dirname, "Frontend/dist")));

    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
    });
}

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log("DB initialized successfully");
    } catch (error) {
        console.log("Error initDB", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server Running on Port ${PORT}`);
    });
});