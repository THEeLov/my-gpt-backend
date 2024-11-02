# MyGPT Backend

This is the backend for MyGPT, a personal ChatGPT-like web application that leverages the OpenAI API to provide dynamic and intelligent responses. Built using Node.js and Express, it manages user authentication, stores conversation history, and facilitates enhanced interactions with the OpenAI API by maintaining context through conversation threads.

🌐 **Deployment on Railway**

This backend is deployed on Railway. Please note that when the server is inactive, it may enter sleep mode, causing the initial request (such as login or API call) to take a little longer to process. You can access the live version of the project here: [MyGPT Backend](https://my-gpt-backend-production.up.railway.app/).

🚀 **Features**

- **User Authentication**: Secure registration and login using JWT.
- **Conversation History**: Store and manage conversation history to provide context for OpenAI API requests, enhancing response quality.
- **OpenAI Integration**: Seamlessly interact with the OpenAI API to process user queries and generate responses.
- **Efficient Data Handling**: Each new message includes the history of messages from the conversation, ensuring coherent interactions with the AI.

🛠️ **Technologies Used**

- **Node.js**: For building the server-side application.
- **Express**: To handle routing and middleware.
- **Prisma**: As an ORM for interacting with the Postgres database.
- **PostgreSQL**: A robust relational database hosted on Supabase.
- **jsonwebtoken**: For managing user authentication and authorization.
- **bcryptjs**: For securely hashing passwords.
- **OpenAI API**: To leverage AI capabilities for generating responses.

🔧 **Additional Considerations**

- **Contextual Conversations**: By sending the history of messages with each request, MyGPT ensures that the AI has the context needed for more meaningful interactions.
- **Scalable Infrastructure**: Deployment on Railway allows for easy scaling and management of server resources.
