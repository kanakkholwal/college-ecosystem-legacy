import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from "next/server";


export const runtime = "edge";

//  read ./document.md file for context 
const getContext = async () => {
    // const filePath = join(process.cwd(), 'document.md');
    // const file = await fs
    //     .readFile(filePath, 'utf8')
    //     .catch(() => {
    //         throw new Error("Error reading file")
    //     });
    return "file";
}


export async function POST(request: NextRequest) {
    try {
        const url = request.nextUrl;
        // const query = url.searchParams.get('query') || '';
        const body = await request.json();

        const { question, context } = body;

        const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

        const fullContext = await getContext();

        const response = await hf.questionAnswering({
            model: 'distilbert-base-uncased-distilled-squad',
            inputs: {
                question,
                context: fullContext + context
            },
        });

        return NextResponse.json({
            answer: response.answer
        }, {
            status: 200
        })

    } catch {
        return NextResponse.json({
            success: false,
            message: "An error occurred"
        }, {
            status: 500
        })
    }

}