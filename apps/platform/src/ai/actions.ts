"use server";
import { CoreMessage, generateObject, NoObjectGeneratedError } from "ai";
import z from "zod";
import { model } from "./api";
import { eventArraySchema } from "./schema";

export async function generateEventsByDoc(images: (string | ArrayBuffer)[]):Promise<{
    error:any | null,
    events:z.infer<typeof eventArraySchema>,
    message:string
}> {
    const prompt: Array<CoreMessage> = [
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Extract events from the provided document.",
                },
                ...(images.map((url) => ({
                    type: "image",
                    image: typeof url === "string" ? new URL(url) : new URL(URL.createObjectURL(new Blob([url]))),
                })) as { type: "image"; image: URL }[]),
            ],
        },
    ];
    try {
        const response = await generateObject({
            model: model,
            schema: eventArraySchema,
            schemaName: "events",
            schemaDescription: "Array of events extracted from the document, each event must follow the events schema.",
            system: `You are an advanced ocr AI that can extract events from a document.
            You will be provided with a document containing various events. Your task is to extract these events and return them in a structured format. Each event should include the title, description, links, time, end date, event type, and location if applicable. Ensure that the extracted events are accurate and well-formatted.`,
            messages: prompt,
            mode: "json"
        });
        // console.dir(response, { depth: null, colors: true });
        return Promise.resolve({
            error: null,
            events: response.object,
            message: response.object.length + " Events generated successfully",
        });
    } catch (error) {
        if (NoObjectGeneratedError.isInstance(error)) {
            return Promise.resolve({
                error: JSON.parse(JSON.stringify(error)),
                events: [],
                message: error.text || "No events were generated from the document. Please ensure the document contains clear and structured event information.",
            });
        }

        // Handle other types of errors
        console.error("An error occurred while generating events from the document:", error);
        return Promise.resolve({
            error: error instanceof Error ? error.message : new Error("An unexpected error occurred"),
            events: [],
            message: "An error occurred while generating events from the document. Please try again later.",
        });
    }
}