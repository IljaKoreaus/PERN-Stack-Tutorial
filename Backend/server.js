import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json()); // Extraction of JSON data
app.use(cors()); // CORS Errors in client
app.use(helmet()); // Helmet Application Security; Middelware; HTTPS Headers
app.use(morgan("dev")); // Logs Requests

app.get("/test", (req, res) => {
    console.log(res.getHeaders());
    res.send("Hello from the backend! You're at /test");
});

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});