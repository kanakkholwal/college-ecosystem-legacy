import { HfInference } from "@huggingface/inference";
import { type NextRequest, NextResponse } from "next/server";

import { COLLEGE_NAME, COLLEGE_WEBSITE } from "~/project.config";


// TODO: create proper document for the chatbot
export const maxDuration = 45;
export const revalidate = 60 * 60 * 24;// 24 hours


const REFERENCES_URLS: string[] = [
  "https://github.com/kanakkholwal/college-ecosystem/raw/refs/heads/main/content/chatbot-reference.md",
  COLLEGE_WEBSITE,
]

async function loadDocument(url: string) {
  const response = await fetch(url);
  const text = await response.text();
  return text;
}

const referencesPromise = await Promise.allSettled(REFERENCES_URLS.map(loadDocument));
const docs = referencesPromise.filter((promise) => promise.status === "fulfilled").map((promise) => promise.value).join("\n");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { query } = body as { query: string };


    const client = new HfInference(process.env.HUGGING_FACE_API_KEY);

    const chatCompletion = await client.chatCompletion({
      model: "google/gemma-1.1-2b-it",
      inputs: {
        context: docs,
        question: query,
      },
      messages: [
        {
          role: "assistant",
          content: docs
        },
        {
          role:"system",
          content:`You are helpful assistant for college of ${COLLEGE_NAME}. You are required to help students or college people for college related stuff and general stuff`
        },
        {
          role:"user",
          content:query
        }

      ],
      provider: "hf-inference",
      max_tokens: 500
    });
    const { answer } = chatCompletion.choices[0].message


    return NextResponse.json(
      {
        answer,
      },
      {
        status: 200,
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
