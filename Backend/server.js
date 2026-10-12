import express from "express";
const port = 3000;

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from the backend! You're at the root");
});

app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
});