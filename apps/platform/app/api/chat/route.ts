import { HfInference } from "@huggingface/inference";
import { type NextRequest, NextResponse } from "next/server";

export const maxDuration = 45; // This function can run for a maximum of 5 seconds
export const revalidate = 0; // disable cache


async function loadDocument() {
  const rootUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const response = await fetch(`${rootUrl}/doc/REFERENCE.md`);
  const text = await response.text();

  return text;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { query } = body as { query: string };

    // let data = await redis.hget("questions", query)
    // if (data) {
    //   return NextResponse.json(
    //     {
    //       answer: data,
    //     },
    //     {
    //       status: 200,
    //     }
    //   );
    // }

    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

    const docs = await loadDocument();
    const response = await hf.questionAnswering({
      model: "deepset/roberta-base-squad2",
      inputs: {
        context: docs,
        question: query,
      },
    });
    const { answer } = response;
    // await redis.hset("questions", { [query]: answer });

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
