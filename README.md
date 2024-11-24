# LangSynth

## Description

This application leverages the Akash Chat API, a permissionless Llama3 API powered by the Akash Supercloud, to provide advanced natural language processing capabilities. Built using Next.js, the application allows users to interact with AI to generate code snippets in their preferred programming language and summarize large text inputs.

## Setting up project

- First, obtain your API key for Akash Chat:

- Go to https://chatapi.akash.network/

- Click Get Started.

- Enter your name, email and Description to generate your API key.

- Create a .env file and store the generated API key as `NEXT_PUBLIC_OPENAI_API_KEY`.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) .


## Implementation of Akash Chat API

Reference documentation : https://akash.network/docs/guides/machine-learning/akash-chat-api/

Server-side functions : 
- API Key Validation: The code first checks if the environment variable NEXT_PUBLIC_OPENAI_API_KEY is set. 
- A client is created using the OpenAI class.
- Reads the incoming JSON body of the request, expecting a prompt, language, and temperature.
- Input Validation.
- Temperature Validation.
- Prompt: The prompt from the user is enhanced with the specified language.
- OpenAI API Call: Using Meta-Llama-3-1-8B-Instruct-FP8
- Response Handling.
- Error handling