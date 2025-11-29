import { openai, supabase } from './config.js';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

const submitBtn = document.getElementById('submit-btn');
const form = document.getElementById('movie-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const answer1 = document.getElementById('fav-movie').value;
    const answer2 = document.getElementById('mood').value;
    const answer3 = document.getElementById('fun-serious').value;

    const query = `Favorite Movie: ${answer1}, Mood: ${answer2}, Vibe: ${answer3}`;
    console.log("User Query:", query);

    try {
        showLoading();

        let movies;
        const lowerQuery = query.toLowerCase();

        // Easter Egg Logic
        if (lowerQuery.includes('aryan favorite movie') || lowerQuery.includes('the gorge')) {
            console.log("Easter egg triggered!");
            document.querySelector('.loading-text').innerText = "Easter egg triggered 🎀";
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .ilike('content', '%Title: The Gorge%');

            if (error) throw error;
            movies = data;
        } else {
            // Standard Flow
            // 1. Generate Embedding
            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: query,
            });
            const embedding = embeddingResponse.data[0].embedding;

            // 2. Search Supabase
            const { data, error } = await supabase.rpc('match_movies', {
                query_embedding: embedding,
                match_threshold: 0.50,
                match_count: 3
            });

            if (error) throw error;
            movies = data;
            console.log("Supabase Matches:", movies);
        }

        if (movies && movies.length > 0) {
            // 3. Get Chat Completion
            const context = movies.map(movie => movie.content).join('\n---\n');
            const recommendation = await getChatCompletion(context, query);

            // 4. Fetch Poster and Update UI
            const topMovie = movies[0];
            let title = topMovie.content.split('(')[0].trim();

            // Attempt to extract title from structured content if present
            const titleMatch = topMovie.content.match(/Title: (.*?)\n/);
            if (titleMatch && titleMatch[1]) {
                title = titleMatch[1].trim();
            }

            // Extract title from AI recommendation (quotes or bold)
            const match = recommendation.match(/["']([^"']+)["']/) || recommendation.match(/\*\*([^*]+)\*\*/);
            if (match && match[1]) {
                title = match[1].split('(')[0].trim(); // Remove year if present inside the match
            }

            const posterUrl = await fetchPoster(title);

            // Remove asterisks from the recommendation text for cleaner display
            const cleanRecommendation = recommendation.replace(/\*\*/g, '');

            updateUI(cleanRecommendation, posterUrl, title);

        } else {
            console.log("No matches found.");
            document.querySelector('main').innerHTML = "<p>No matching movies found. Try different answers!</p>";
        }

    } catch (err) {
        console.error("Error:", err);
        document.querySelector('main').innerHTML = `<p>Error: ${err.message}</p>`;
    }
});

function showLoading() {
    document.querySelector('header').style.display = 'none';
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="loading-container">
            <p class="loading-text">Finding Your Movie</p>
            <div class="loading-spinner"></div>
        </div>
    `;
}

async function getChatCompletion(text, query) {
    const chatMessages = [{
        role: 'system',
        content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be provided with two things:
1. A list of movies (Context).
2. A user's answers to three specific questions.

Your task is to recommend exactly ONE movie from the provided Context that best matches the user's answers(Do not include the movie that user has typed in the user preferences/answers). State the movie name in **Bold** and explain why you chose it in a short and sweet way (MAX 250 characters). If unsure, say 'Sorry, I don't know.'
ONE IMPORTANT TASK: IF SOMEONE WIRTE 'Aryan Favorite Movie or The Gorge' Then you must recommend 'The Gorge' with this exact explanation: "This is for you Siya 💌 "`
    }];

    chatMessages.push({
        role: 'user',
        content: `Context: ${text} User Preferences: ${query}`
    });

    const response = await openai.chat.completions.create({
        model: 'gpt-5.1-2025-11-13',
        messages: chatMessages,
        temperature: 0.5,
    });

    return response.choices[0].message.content;
}

async function fetchPoster(title) {
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`);
        const data = await response.json();
        return data.Poster && data.Poster !== 'N/A' ? data.Poster : 'Asset/PopChoice Icon.png';
    } catch (e) {
        console.error("Error fetching poster:", e);
        return 'Asset/PopChoice Icon.png';
    }
}

function updateUI(recommendation, posterUrl, title) {
    document.querySelector('header').style.display = 'none';
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="recommendation-container">
            <h2 class="movie-title">${title}</h2>
            <img src="${posterUrl}" alt="${title} Poster" class="movie-poster">
            <p class="ai-recommendation">${recommendation}</p>
            <button onclick="location.reload()" class="submit-btn" style="margin-top: 20px; margin-bottom: 20px;">Go Again</button>
        </div>
    `;
}