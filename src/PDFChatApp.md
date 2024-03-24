### System Design Overview
- User uploads a PDF
- We generate embeddings for the PDF
- user asks questions about the PDF
- we use the embeddings to find the relevant section of the PDF
- put the question and the relevant section of the PDF into the LLM
- LLM returns the answer to the user
- User can like or dislike the answer

### Pinecone.io vector DB
- pinecone.io is a hosted vector database
- need to enter in the dimensions of the vectors, look at the docs for the chosen embedding, embedding for OpenAI is 1536 (at time of Udemy course)
- Need to initialize the pinecone client, either from pinecone SDK or langchain wrapper around pinecone
- with langchain can do `vectorDB.add_documents` to load embeddings
- with langchain can do `vectorDB.as_retreiver`

### Concurrency, Jobs, and Redis
- Embedding is slow so we want to use a job queue
- in the Udemy course Stephen uses python Celery with Redis

### Custom message history
- store messages in a DB (sqlite for example)
- pull all messages from a conversation & provide it to the chain