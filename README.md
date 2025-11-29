# PopChoice - AI Movie Recommender 🍿

PopChoice is an intelligent movie recommendation application that uses the power of AI to find the perfect movie for you based on your specific mood and preferences.

![alt text](image.png)

## 🚀 How It Works

The application follows a sophisticated pipeline to deliver accurate recommendations:

1.  **Data Processing**: Raw movie data is processed and chunked using **LangChain** to prepare it for embedding.
2.  **Vector Embeddings**: These text chunks are converted into vector embeddings using **OpenAI's Embedding API**.
3.  **Vector Storage**: The generated embeddings are stored in a **Supabase** Vector database, allowing for semantic search capabilities.
4.  **Similarity Search**: When a user describes their preference (e.g., "I want a fun 90s action movie"), the query is converted into an embedding. The app then performs a similarity search in Supabase to find the top 3 movies that semantically match the user's intent.
5.  **AI Recommendation**: The context of these top 3 matches is sent to **OpenAI's Chat Completion API**. Acting as an enthusiastic movie expert, the AI analyzes the options and selects the single best recommendation, providing a personalized explanation.
6.  **Visuals**: Finally, the application fetches the official movie poster using the **OMDB API** to display a rich UI.

![alt text](image-1.png)


## 🛠️ Tech Stack

*   **Frontend**: HTML, CSS, JavaScript (built with **Vite**)
*   **AI & NLP**: 
    *   **OpenAI API** (Embeddings & Chat Completions)
    *   **LangChain** (Text Chunking & Processing)
*   **Database**: **Supabase** (PostgreSQL with pgvector for vector similarity search)
*   **External APIs**: **OMDB API** (Movie Posters)

## 🚦 Getting Started

### Prerequisites

*   Node.js installed
*   An OpenAI API Key
*   A Supabase Project with Vector support enabled
*   An OMDB API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd AI-movie-maker
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your API keys:
    ```env
    VITE_OPENAI_API_KEY=your_openai_api_key
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_API_KEY=your_supabase_anon_key
    ```

4.  **Run the Application**
    ```bash
    npm run dev
    ```

    Open your browser and navigate to the local server url (usually `http://localhost:5173`).

## 📝 License

This project is created for educational purposes.