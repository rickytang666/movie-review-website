import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('public'));

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export default app;
