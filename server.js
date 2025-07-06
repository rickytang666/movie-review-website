import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import reviews from "./api/reviews.route.js";

// Load environment variables
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files first
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/v1/reviews", reviews);

const API_KEY = process.env.TMDB_API_KEY;

// Movie routes
app.get('/api/movies', async (req, res) => {
    const {query, page = 1} = req.query;

    let url;
    if (query) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    } else {
        url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${page}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// Catch-all route for API endpoints not found
app.use("/api/*", (req, res) => res.status(404).json({error: "API endpoint not found"}));

// Catch-all route - serve index.html for any other routes (for SPA support)
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;
