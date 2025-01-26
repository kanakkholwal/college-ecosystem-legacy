// // app/api/chat/route.ts

// import { HfInference } from '@huggingface/inference'
// import { HuggingFaceStream, StreamingTextResponse } from 'ai'

// import { COLLEGE_NAME, COLLEGE_WEBSITE } from "~/project.config";


// // TODO: create proper document for the chatbot
// export const maxDuration = 45;
// // export const revalidate = 60 * 60 * 24;// 24 hours


// const REFERENCES_URLS: string[] = [
//   "https://github.com/kanakkholwal/college-ecosystem/raw/refs/heads/main/content/chatbot-reference.md",
//   COLLEGE_WEBSITE,
// ]

// async function loadDocument(url: string) {
//   const response = await fetch(url);
//   const text = await response.text();
//   return text;
// }
// const referencesPromise = await Promise.allSettled(REFERENCES_URLS.map(loadDocument));
// const docs = referencesPromise.filter((promise) => promise.status === "fulfilled").map((promise) => promise.value).join("\n");

// // Create a new HuggingFace Inference instance
// const Hf = new HfInference(process.env.HUGGING_FACE_API_KEY)

// // Build Gemma prompt from the messages
// function buildPrompt(
//   messages: { content: string; role: 'system' | 'user' | 'assistant' }[]
// ) {
//   return messages
//     .map(m =>
//       m.role === 'user'
//         ? `<start_of_turn>user\n${m.content}<end_of_turn>`
//         : `<start_of_turn>model\n${m.content}<end_of_turn>`
//     )
//     .join('\n');
// }

// export async function POST(req: Request) {
//   // Extract the `messages` from the body of the request
//   const { messages } = await req.json();

//   // Request the HuggingFace API for the response based on the prompt
//   const response = await Hf.textGenerationStream({
//     model: 'google/gemma-7b-it',
//     inputs: [
//         {
//             role: 'system',
//             content: `You are helpful assistant for college of ${COLLEGE_NAME}. You are required to help students or college people for college related stuff and general stuff`
//         },
//         {
//             role: 'assistant',
//             content: docs
//         },
//         ...buildPrompt(messages),
//     ],
//     parameters: {
//       max_new_tokens: 1024,
//       temperature: 0.5,
//       top_p: 0.95,
//       top_k: 4,
//       repetition_penalty: 1.03,
//       truncate: 1000,
//     }
//   })

//   // Convert the response into a friendly text-stream
//   const stream = HuggingFaceStream(response)

//   // Respond with the stream
//   return new StreamingTextResponse(stream)
// }
