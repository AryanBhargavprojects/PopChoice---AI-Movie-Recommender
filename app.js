import { openai, supabase } from './config.js';
import movies from './content.js';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

async function splitDocument() {
    const initialtext = movies.map(movie =>
        `Title: ${movie.title}\nRelease Year: ${movie.releaseYear}\nContent: ${movie.content}`
    ).join('\n');
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500, // created 35 chunks
        chunkOverlap: 100,
    });
    const output = await splitter.createDocuments([initialtext]);
    console.log(output);
    return output;
}

// creating embedding of the chunk text and storing it in the database
async function createandstoreEmbeddings() {
    const chunkData = await splitDocument()
    const data = await Promise.all(
        chunkData.map(async (chunk) => {
            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: chunk.pageContent,
            })
            return {
                content: chunk.pageContent,
                embedding: embeddingResponse.data[0].embedding,
            }
        })
    )
    console.log(data)
    await supabase.from('movies').insert(data)
}
createandstoreEmbeddings()